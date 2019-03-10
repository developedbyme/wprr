import React from 'react';
import objectPath from "object-path";

import WprrBaseObject from "wprr/WprrBaseObject";

import ReferenceInjection from "wprr/reference/ReferenceInjection";
import ContentCreatorSingleItem from "wprr/elements/create/ContentCreatorSingleItem";
import SourceData from "wprr/reference/SourceData";
import Loop from "wprr/elements/create/Loop";
import Adjust from "wprr/manipulation/Adjust";
import SortArray from "wprr/manipulation/adjustfunctions/logic/SortArray";
import MarkupLoop from "wprr/manipulation/adjustfunctions/loop/MarkupLoop";
import Markup from "wprr/markup/Markup";
import MarkupChildren from "wprr/markup/MarkupChildren";
import MarkupPlacement from "wprr/markup/MarkupPlacement";
import UseMarkup from "wprr/markup/UseMarkup";
import SourcedText from "wprr/elements/text/SourcedText";
import SourceDataWithPath from "wprr/reference/SourceDataWithPath";
import GetFirstResolvingSource from "wprr/manipulation/adjustfunctions/GetFirstResolvingSource";
import InsertElement from "wprr/manipulation/InsertElement";

//import Table from "wprr/elements/area/table/Table";
export default class Table extends WprrBaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._mainElementType = "table";
	}
	
	_renderMainElement() {
		//console.log("wprr/elements/area/table/Table::_renderMainElement");
		
		let markup = this.getFirstValidSource(
			SourceData.create("prop", "markup"),
			SourceData.create("referenceIfExists", "table/markup"),
			React.createElement(Markup, {"usedPlacements": "header"},
				React.createElement("thead", {},
					React.createElement("tr", {},
						React.createElement(MarkupChildren, {"placement": "header"})
					)
				),
				React.createElement("tbody", {},
					React.createElement(MarkupChildren, {"placement": "rest"})
				)
			)
		);
		
		let columns = this.getSourcedProp("columns");
		let rows = this.getSourcedProp("rows");
		
		let headerRowItemMarkup = this.getFirstValidSource(
			SourceData.create("prop", "headerRowItemMarkup"),
			SourceData.create("referenceIfExists", "table/headerRowItem"),
			React.createElement("th", {},
				React.createElement(SourcedText, {"text": SourceDataWithPath.create("reference", "loop/cell/item", "label")})
			)
		);
		
		let defaultRowItemContentElement = React.createElement(Adjust, {"adjust": Table._adjust_getRowItemContent},
			React.createElement(SourcedText, {"text": SourceDataWithPath.create("reference", "loop/cell/item", "label"), "format": "html"})
		);
		
		let rowItemMarkup = this.getFirstValidSource(
			SourceData.create("prop", "rowItemMarkup"),
			SourceData.create("referenceIfExists", "table/rowItem"),
			React.createElement("th", {},
				React.createElement(Adjust, {"adjust": [
					Table._adjust_getContentSources,
					GetFirstResolvingSource.create(SourceData.create("prop", "sources"), this, "element")
				], "defaultElement": defaultRowItemContentElement},
					React.createElement(InsertElement, {})
				)
			)
		);
		
		let rowMarkup = this.getFirstValidSource(
			SourceData.create("prop", "rowMarkup"),
			SourceData.create("referenceIfExists", "table/row"),
			React.createElement("tr", {},
				React.createElement(Loop, {"loop": MarkupLoop.create(columns, rowItemMarkup), "loopName": "cell"})
			)
		);
		
		return React.createElement("wrapper", {},
			React.createElement(UseMarkup, {"markup": markup},
				React.createElement(MarkupPlacement, {"placement": "header"},
					React.createElement(Loop, {"loop": MarkupLoop.create(columns, headerRowItemMarkup), "loopName": "cell"})
				),
				React.createElement(Loop, {"loop": MarkupLoop.create(rows, rowMarkup), "loopName": "row"})
			)
		);
	}
	
	static _adjust_getContentSources(aProps, aElement) {
		//console.log("wprr/elements/area/table/Table::_adjust_getContentSources");
		
		let rowData = aElement.getReference("loop/row/item");
		let cellData = aElement.getReference("loop/cell/item");
		
		let sources = new Array();
		
		let key = objectPath.get(cellData, "key");
		let type = objectPath.get(cellData, "type");
		
		let referencePrefix = "table/";
		
		sources.push(SourceData.create("prop", "rowItemContent/key/" + key));
		sources.push(SourceData.create("referenceIfExists", referencePrefix + "rowItemContent/key/" + key));
		
		if(type) {
			sources.push(SourceData.create("prop", "rowItemContent/type/" + type));
			sources.push(SourceData.create("referenceIfExists", referencePrefix + "rowItemContent/type/" + type));
		}
		
		sources.push(SourceData.create("prop", "rowItemContent/default"));
		sources.push(SourceData.create("referenceIfExists", referencePrefix + "rowItemContent/default"));
		
		sources.push(aProps["defaultElement"]);
		
		delete aProps["defaultElement"];
		aProps["sources"] = sources;
		
		return aProps;
	}
	
	static _adjust_getRowItemContent(aProps, aElement) {
		let rowData = aElement.getReference("loop/row/item");
		let cellData = aElement.getReference("loop/cell/item");
		
		let key = objectPath.get(cellData, "key");
		
		let data = objectPath.get(rowData, key);
		if(data) {
			aProps["text"] = data;
		}
		else {
			aProps["text"] = "";
		}
		
		return aProps;
	}
}
