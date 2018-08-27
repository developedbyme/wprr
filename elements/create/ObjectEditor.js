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

//import ObjectEditor from "wprr/elements/create/ObjectEditor";
export default class ObjectEditor extends ManipulationBaseObject {
	
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
		
		let object = this.getSourcedProp("object");
		
		this._externalStorage.setData(object);
	}
	
	_renderMainElement() {
		
		let object = this.getSourcedProp("object");
		let rows = this._getRows(object);
		
		let clonedElements = super._renderMainElement();
		let injectData = new Object();
		
		injectData["objectEditor/externalStorage"] = this._externalStorage;
		
		return <ReferenceInjection injectData={injectData}>
			<Adjust adjust={SetDefaultProps.create({"markup": ObjectEditor.DEFAULT_ROW_MARKUP})}>
				<ReferenceInjection injectData={{"objectEditor/loopMarkup": SourceData.create("prop", "markup")}}>
					<Loop input={rows} loop={MarkupLoop.create()} />
				</ReferenceInjection>
			</Adjust>
		</ReferenceInjection>
	}
}

ObjectEditor.DEFAULT_ROW_MARKUP = <SelectSection selectedSections={SourceDataWithPath.create("reference", "loop/item", "type")}>
	<div data-section-name="string">
		<FlexRow className="halfs justify-between">
			<SourcedText text={SourceDataWithPath.create("reference", "loop/item", "name")} />
			<EditableProps editableProps={SourceDataWithPath.create("reference", "loop/item", "name")} externalStorage={SourceData.create("reference", "objectEditor/externalStorage")}>
				<FormField type="text" valueName={SourceDataWithPath.create("reference", "loop/item", "name")} />
			</EditableProps>
		</FlexRow>
	</div>
	<div data-section-name="number">
		<FlexRow className="halfs justify-between">
			<SourcedText text={SourceDataWithPath.create("reference", "loop/item", "name")} />
			<EditableProps editableProps={SourceDataWithPath.create("reference", "loop/item", "name")} externalStorage={SourceData.create("reference", "objectEditor/externalStorage")}>
				<FormField type="number" valueName={SourceDataWithPath.create("reference", "loop/item", "name")} />
			</EditableProps>
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
</SelectSection>;