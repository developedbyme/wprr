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
		
		return <ReferenceInjection injectData={injectData}>
			<Adjust adjust={SetDefaultProps.create({"markup": MultipleObjectsEditor.DEFAULT_ROW_MARKUP})}>
				<ReferenceInjection injectData={{
					"objectEditor/loopMarkup": SourceData.create("prop", "markup"),
				}}>
					<Loop input={mergedRows} loop={MarkupLoop.create()} />
				</ReferenceInjection>
			</Adjust>
		</ReferenceInjection>
	}
}

MultipleObjectsEditor.DEFAULT_TEXT_FIELD_MARKUP = <Adjust adjust={[Combine.create([SourceData.create("reference", "loop/fileIndex/item"),".",SourceDataWithPath.create("reference", "loop/item", "name")], "fieldName"), JoinArray.create(SourceData.create("prop", "fieldName"), "", "valueName")]}>
	<EditableProps editableProps={SourceData.create("prop", "valueName")} externalStorage={SourceData.create("reference", "objectEditor/externalStorage")}>
		<FormField type="text" valueName={SourceDataWithPath.create("reference", "loop/item", "name")} />
	</EditableProps>
</Adjust>;

MultipleObjectsEditor.DEFAULT_ROW_MARKUP = <SelectSection selectedSections={SourceDataWithPath.create("reference", "loop/item", "type")}>
	<div data-section-name="string">
		<FlexRow className="halfs justify-between">
			<SourcedText text={SourceDataWithPath.create("reference", "loop/item", "name")} />
			<Loop loopName="fileIndex" input={SourceData.create("reference", "objectEditor/filePrefixes")} loop={MarkupLoop.create()} markup={MultipleObjectsEditor.DEFAULT_TEXT_FIELD_MARKUP}>
				<FlexRow />
			</Loop>
		</FlexRow>
	</div>
	<div data-section-name="object">
		<div className="">
			<SourcedText text={SourceDataWithPath.create("reference", "loop/item", "name")} />
			<hr />
			<Loop input={SourceDataWithPath.create("reference", "loop/item", "children")} loop={MarkupLoop.create()} markup={SourceData.create("reference", "objectEditor/loopMarkup")} />
		</div>
	</div>
	<div data-section-name="array">
		<div className="">
			<SourcedText text={SourceDataWithPath.create("reference", "loop/item", "name")} />
			<hr />
			<Loop input={SourceDataWithPath.create("reference", "loop/item", "children")} loop={MarkupLoop.create()} markup={SourceData.create("reference", "objectEditor/loopMarkup")} />
			<TriggerButton triggerName="objectEditor/addRow" triggerData={SourceDataWithPath.create("reference", "loop/item", "name")}>
				<div>Add row</div>
			</TriggerButton>
		</div>
	</div>
	<div data-section-name="conflict">
		<div className="">
			<SourcedText text={SourceDataWithPath.create("reference", "loop/item", "name")} />
			<div>Conflicting type</div>
		</div>
	</div>
</SelectSection>;