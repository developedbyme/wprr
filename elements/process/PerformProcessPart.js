import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

export default class PerformProcessPart extends Layout {
	
	_construct() {
		super._construct();
		
		this._layoutName = "performProcessPart";
		
	}
	
	_getLayout(aSlots) {
		
		let type = this.getFirstInputWithDefault("type", Wprr.sourceReference("processPart", "type"), "none");
		
		let typeElement = Wprr.sourceReference("items", "project.processPartElements." + type);
		
		return <React.Fragment>
			<Wprr.HasData check={typeElement}>
				<Wprr.InsertElement element={typeElement.deeper("insertElement")} />
			</Wprr.HasData>
			<Wprr.HasData check={typeElement} checkType="invert/default">
				<Wprr.TextWithReplacements text="No interface for type {type}" replacements={{"{type}": type}} />
			</Wprr.HasData>
		</React.Fragment>;
	}
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		let dataSettings = {
			
		};
		
		return React.createElement(Wprr.layout.admin.WpBlockEditor, {dataSettings: dataSettings},
			React.createElement("div", null)
		);
	}
}
