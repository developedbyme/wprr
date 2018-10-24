import React from "react";

import ManipulationBaseObject from "wprr/manipulation/ManipulationBaseObject";

import InjectChildren from "wprr/manipulation/InjectChildren";
import ReferenceInjection from "wprr/reference/ReferenceInjection";
import Loop from "wprr/elements/create/Loop";
import MarkupLoop from "wprr/manipulation/adjustfunctions/loop/MarkupLoop";
import SetDefaultProps from "wprr/manipulation/adjustfunctions/SetDefaultProps";
import Adjust from "wprr/manipulation/Adjust";
import SelectSection from "wprr/elements/area/SelectSection";
import SourceData from "wprr/reference/SourceData";
import SourceDataWithPath from "wprr/reference/SourceDataWithPath";
import SourcedText from "wprr/elements/text/SourcedText";
import FlexRow from "wprr/elements/area/grid/FlexRow";
import DataStorage from "wprr/utils/DataStorage";
import EditableProps from "wprr/manipulation/EditableProps";
import FormField from "wprr/elements/form/FormField";
import TriggerButton from "wprr/elements/interaction/TriggerButton";
import Combine from "wprr/manipulation/adjustfunctions/logic/Combine";
import JoinArray from "wprr/manipulation/adjustfunctions/text/JoinArray";

//import MultipleObjectsEditor from "wprr/elements/create/MultipleObjectsEditor";
export default class MultipleObjectsEditor extends ManipulationBaseObject {
	
	constructor(props) {
		super(props);
		
		this._externalStorage = new DataStorage();
	}
	
	getObject() {
		return this._externalStorage.getData();
	}
	
	_createRowData(aName, aData, aType, aChildren) {
		let newRow = new Object();
		
		newRow["name"] = aName;
		newRow["data"] = aData;
		newRow["type"] = aType;
		newRow["children"] = aChildren;
		
		return newRow;
	}
	
	_encodeData(aName, aData) {
		let type = typeof(aData);
		if(type === "object" && Array.isArray(aData)) {
			type = "array";
		}
		
		let children = null;
		switch(type) {
			case "object":
				children = this._getRows(aData, aName + ".");
				break;
			case "array":
				children = new Array();
				let currentArray = aData;
				let currentArrayLength = currentArray.length;
				for(let i = 0; i < currentArrayLength; i++) {
					let currentData = currentArray[i];
					children.push(this._encodeData(aName + "." + i, currentData));
				}
				break;
		}
		
		return this._createRowData(aName, aData, type, children);
	}
	
	_getRows(aObject, aPrefix = "") {
		
		let returnRows = new Array();
		
		let objectData = aObject;
		for(let objectName in objectData) {
			let rowData = objectData[objectName];
			
			let name = aPrefix + objectName;
			
			returnRows.push(this._encodeData(name, rowData));
		}
		
		return returnRows;
	}
	
	_prepareRender() {
		super._prepareRender();
		
		let objects = this.getSourcedProp("objects");
		
		this._externalStorage.setData(objects);
	}
	
	_createMultipleRowData() {
		let newRowData = new Object();
		
		newRowData["keys"] = new Array();
		newRowData["values"] = new Object();
		newRowData["children"] = new Object();
		
		return newRowData;
	}
	
	_addRowDataToMultipleRowData(aRows, aIndex, aReturnData) {
		let currentArray = aRows;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentRow = currentArray[i];
			let currentName = currentRow.name;
			if(aReturnData.keys.indexOf(currentRow.name) === -1) {
				aReturnData.keys.push(currentName);
				aReturnData.values[currentName] = new Array();
				aReturnData.children[currentName] = this._createMultipleRowData();
			}
			aReturnData.values[currentName][aIndex] = currentRow;
			if(currentRow.children) {
				this._addRowDataToMultipleRowData(currentRow.children, aIndex, aReturnData.children[currentName]);
			}
		}
	}
	
	_getMultipleType(aDatas) {
		let currentType = null;
		
		let currentArray = aDatas;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentData = currentArray[i];
			if(currentData) {
				if(currentType === null) {
					currentType = currentData.type;
				}
				else if(currentType !== currentData.type) {
					return "conflict";
				}
			}
		}
		
		return currentType;
	}
	
	_mergeMultipleRowData(aData) {
		let returnRows = new Array();
		
		let currentArray = aData.keys;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let name = currentArray[i];
			let datas = aData.values[name];
			let type = this._getMultipleType(datas);
			
			let children = this._mergeMultipleRowData(aData.children[name]);
			
			returnRows.push(this._createRowData(name, datas, type, children));
		}
		
		return returnRows;
	}
	
	_renderMainElement() {
		
		let objects = this.getSourcedProp("objects");
		
		let mainMultipleRow = this._createMultipleRowData();
		
		let currentArray = objects;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentObject = currentArray[i];
			let currentRows = this._getRows(currentObject);
			this._addRowDataToMultipleRowData(currentRows, i, mainMultipleRow);
		}
		
		let mergedRows = this._mergeMultipleRowData(mainMultipleRow);
		
		let clonedElements = super._renderMainElement();
		let injectData = new Object();
		
		injectData["objectEditor/filePrefixes"] = [0, 1]; //METODO: set dynamic length
		injectData["objectEditor/externalStorage"] = this._externalStorage;
		
		return React.createElement(ReferenceInjection, {injectData: injectData},
			React.createElement(Adjust, {adjust: SetDefaultProps.create({"markup": MultipleObjectsEditor.DEFAULT_ROW_MARKUP})},
				React.createElement(ReferenceInjection, {injectData: {"objectEditor/loopMarkup": SourceData.create("prop", "markup")}},
					React.createElement(Loop, {input: mergedRows, loop: MarkupLoop.create()})
				)
			)
		);
	}
}

MultipleObjectsEditor.DEFAULT_TEXT_FIELD_MARKUP = React.createElement(Adjust, {adjust: [Combine.create([SourceData.create("reference", "loop/fileIndex/item"),".",SourceDataWithPath.create("reference", "loop/item", "name")], "fieldName"), JoinArray.create(SourceData.create("prop", "fieldName"), "", "valueName")]},
React.createElement(EditableProps, {editableProps: SourceData.create("prop", "valueName"), externalStorage: SourceData.create("reference", "objectEditor/externalStorage")},
		React.createElement(FormField, {type: "text", valueName: SourceDataWithPath.create("reference", "loop/item", "name")})
	)
);

MultipleObjectsEditor.DEFAULT_ROW_MARKUP = React.createElement(SelectSection, {selectedSections: SourceDataWithPath.create("reference", "loop/item", "type")},
	React.createElement("div", {"data-section-name": "string"}, 
		React.createElement(FlexRow, {className: "halfs justify-between"},
			React.createElement(SourcedText, {text: SourceDataWithPath.create("reference", "loop/item", "name")}),
			React.createElement(Loop, {loopName: "fileIndex", input: SourceData.create("reference", "objectEditor/filePrefixes"), loop: MarkupLoop.create(), markup: MultipleObjectsEditor.DEFAULT_TEXT_FIELD_MARKUP},
				React.createElement(FlexRow)
			)
		)
	),
	React.createElement("div", {"data-section-name": "object"},
		React.createElement("div", {},
			React.createElement(SourcedText, {text: SourceDataWithPath.create("reference", "loop/item", "name")}),
			React.createElement("hr"),
			React.createElement(Loop, {input: SourceDataWithPath.create("reference", "loop/item", "children"), loop: MarkupLoop.create(), markup: SourceData.create("reference", "objectEditor/loopMarkup")})
		)
	),
	React.createElement("div", {"data-section-name": "array"},
		React.createElement("div", {},
			React.createElement(SourcedText, {text: SourceDataWithPath.create("reference", "loop/item", "name")}),
			React.createElement("hr"),
			React.createElement(Loop, {input: SourceDataWithPath.create("reference", "loop/item", "children"), loop: MarkupLoop.create(), markup: SourceData.create("reference", "objectEditor/loopMarkup")}),
			React.createElement(TriggerButton, {triggerName: "objectEditor/addRow", triggerData: SourceDataWithPath.create("reference", "loop/item", "name")}, 
				React.createElement("div", {}, "Add row")
			)
		)
	),
	React.createElement("div", {"data-section-name": "conflict"},
		React.createElement("div", {},
			React.createElement(SourcedText, {text: SourceDataWithPath.create("reference", "loop/item", "name")}),
			React.createElement("div", {}, "Conflicting type")
		)
	)
);