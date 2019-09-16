import queryString from "query-string";

import React from 'react';
import ReactDOM from 'react-dom';
import Wprr from "wprr/Wprr";
import WprrBaseObject from "wprr/WprrBaseObject";

//import PostRangePathSelector from "wprr/wp/admin/rangeselection/PostRangePathSelector";
export default class PostRangePathSelector extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	updateValue(aName, aValue, aAdditionalData) {
		console.log("wprr/wp/admin/rangeselection/PostRangePathSelector::updateValue");
		
		let valueName = this.getSourcedProp("valueName");
		let value = this.getSourcedPropWithDefault("value", Wprr.source("propWithDots", valueName));
		
		let currentUrl = value;
		let selectedParameters = this._getParametersFromUrl(currentUrl);
		
		selectedParameters[aName] = aValue;
		
		let newPath = selectedParameters["path"];
		
		let nextDelimiter = "?";
		
		let currentArray = ["taxonomy", "terms", "termsField", "order", "orderby"];
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentName = currentArray[i];
			if(selectedParameters[currentName] && selectedParameters[currentName] !== "") {
				newPath += nextDelimiter + currentName + "=" + selectedParameters[currentName];
				nextDelimiter = "&";
			}
		}
		
		let valueUpdater = this.getReference("value/" + valueName);
		
		if(valueUpdater) {
			valueUpdater.updateValue(valueName, newPath);
		}
		else {
			console.error("No value updater available, can't set " + valueName + " to " + newPath, this);
		}
	}
	
	_getParametersFromUrl(aUrl) {
		let returnObject = new Object();
		
		if(typeof(aUrl) === "string") {
			let questionMarkIndex = aUrl.indexOf("?");
		
			if(questionMarkIndex !== -1) {
				returnObject = queryString.parse(aUrl.substring(questionMarkIndex+1, aUrl.length));
				
				returnObject["path"] = aUrl.substring(0, questionMarkIndex);
			}
			else {
				returnObject["path"] = aUrl;
			}
		}
		
		if(!returnObject["path"]) {
			let prefix = this.getSourcedPropWithDefault("prefix", "wprr/v1/range");
			let selectors = this.getSourcedPropWithDefault("selectors", "inTaxonomy");
			let encoders = this.getSourcedPropWithDefault("encoders", "default");
			
			returnObject["path"] = prefix + "/any/" + selectors + "/" + encoders;
		}
		
		if(!returnObject["taxonomy"]) {
			returnObject["taxonomy"] = "category";
		}
		
		if(!returnObject["termsField"]) {
			returnObject["termsField"] = "id";
		}
		
		
		return returnObject;
	}
	
	render() {
		console.log("wprr/wp/admin/rangeselection/PostRangePathSelector::render");
		
		let valueName = this.getSourcedProp("valueName");
		let value = this.getSourcedPropWithDefault("value", Wprr.source("propWithDots", valueName));
		
		let currentUrl = value;
		
		let selectedParameters = this._getParametersFromUrl(currentUrl);
		
		let prefix = this.getSourcedPropWithDefault("prefix", "wprr/v1/range");
		let selectors = this.getSourcedPropWithDefault("selectors", "inTaxonomy");
		let encoders = this.getSourcedPropWithDefault("encoders", "default");
		
		//METODO: these needs to be loaded
		let typeOptions = [
			{"value": prefix + "/any/" + selectors + "/" + encoders, "label": "Any type"},
			{"value": prefix + "/post/" + selectors + "/" + encoders, "label": "Posts"}
		];
		
		let orderOptions = [
			{"value": "", "label": this.translate("(not selected)")},
			{"value": "ASC", "label": this.translate("Ascending")},
			{"value": "DESC", "label": this.translate("Descending")},
		];
		
		let orderbyOptions = [
			{"value": "", "label": this.translate("(no selected order)")},
			{"value": "title", "label": this.translate("Alphabetical order")},
			{"value": "date", "label": this.translate("Publish date order")},
		];
		
		let selectedTaxonomy = selectedParameters["taxonomy"];
		
		let injectionObject = {
			"value/path": this,
			"value/taxonomy": this,
			"value/terms": this,
			"value/order": this,
			"value/orderby": this,
		}
		
		return React.createElement(Wprr.ReferenceInjection, {"injectData": injectionObject},
			React.createElement("div", {},
				React.createElement(Wprr.Selection, {"valueName": "path", "selection": selectedParameters["path"], "options": typeOptions}),
				React.createElement(Wprr.DataLoader, {"loadData": {"taxonomies": "wprr/v1/taxonomies"}},
					React.createElement(Wprr.Adjust, {"adjust": Wprr.adjusts.optionsFromTaxonomies(Wprr.sourceProp("taxonomies"))},
						React.createElement(Wprr.Selection, {"valueName": "taxonomy", "selection": selectedTaxonomy})
					)
				),
				React.createElement(Wprr.DataLoader, {"loadData": {"terms": "wprr/v1/taxonomy/" + selectedTaxonomy + "/terms"}},
					React.createElement(Wprr.Adjust, {"adjust": [
						Wprr.adjusts.optionsFromTerms(Wprr.sourceProp("terms")),
						Wprr.adjusts.addToArray(Wprr.sourceProp("options"), {"value": 0, "label": this.translate("(no term selected)")}, true, "options")
					]},
						React.createElement(Wprr.Selection, {"valueName": "terms", "selection": selectedParameters["terms"]})
					)
				),
				Wprr.translateText("in"),
				React.createElement(Wprr.Selection, {"valueName": "order", "selection": selectedParameters["order"], "options": orderOptions}),
				React.createElement(Wprr.Selection, {"valueName": "orderby", "selection": selectedParameters["orderby"], "options": orderbyOptions})
			)
		);
	}
}
