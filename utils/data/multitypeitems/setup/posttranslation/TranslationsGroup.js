import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import TranslationsGroup from "./TranslationsGroup";
export default class TranslationsGroup extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		//console.log("TranslationsGroup::prepare");
		
		aItem.requireValue("hasData/posttranslation/translationsGroup", false);
		aItem.requireSingleLink("of");
		aItem.getLinks("posts");
		
		let projectItem = aItem.group.getItem("project");
		
		let getItemBy = aItem.addNode("getTranslationNode", new Wprr.utils.data.nodes.GetItemBy());
		
		getItemBy.item.setValue("propertyPath", "language.value");
		getItemBy.item.getLinks("items").input(aItem.getLinks("posts"));
		getItemBy.item.getValueSource("value").input(projectItem.getValueSource("language"));
		
		aItem.requireSingleLink("translatedPost").idSource.input(getItemBy.item.getType("item").idSource);
		
		return this;
	}
	
	static setup(aItem, aData) {
		//console.log("TranslationsGroup::setup");
		//console.log(aItem, aData);
		
		aItem.addSingleLink("of", aData["of"]);
		aItem.getLinks("posts").setItems(aData["posts"]);
		aItem.setValue("hasData/posttranslation/translationsGroup", true);
		
		//METODO: needs to rerun get translation after all has been setup as posts might not have language setup at this time
		
		return this;
	}
}