import objectPath from "object-path";
import Wprr from "wprr/Wprr";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

// import ItemPostData from "wprr/wp/postdata/ItemPostData";
export default class ItemPostData extends MultiTypeItemConnection {
	
	constructor() {
		super();
	}
	
	setData(aData) {
		//console.log("wprr/wp/postdata/ItemPostData::setData");
		
		
		return this;
	}
	
	get data() {
		return null;
	}
	
	getData() {
		return null;
	}
	
	getDataValue(aField) {
		return null;
	}
	
	hasObjectPathHandling() {
		return true;
	}
	
	getValueForPath(aPath) {
		//console.log("wprr/wp/postdata/ItemPostData::getValueForPath");
		return this.getDataValue(aPath);
	}
	
	getId() {
		//console.log("wprr/wp/postdata/ItemPostData::getId");
		//console.log(this._data);
		
		return this.item.id;
	}
	
	getTitle() {
		//console.log("wprr/wp/postdata/ItemPostData::getTitle");
		//console.log(this._data);
		
		return this.item.getValue("title");
	}
	
	getExcerpt() {
		//console.log("wprr/wp/postdata/ItemPostData::getExcerpt");
		//console.log(this._data);
		
		return this.item.getValue("excerpt");
	}
	
	getImage() {
		//console.log("wprr/wp/postdata/ItemPostData::getImage");
		//console.log(this._data);
		
		let imageItem = Wprr.objectPath(this.item, "image.linkedItem");
		
		if(imageItem) {
			
			let imageData = {
				"alt": imageItem.getValue("alt"),
				"sizes": imageItem.getType("sizes")
			}
			
			return imageData;
		}
		
		return null;
	}
	
	getContent() {
		return this.item.getValue("content");
	}
	
	getPermalink() {
		return this.item.getValue("permalink");
	}
	
	getType() {
		return this.item.getValue("postType");
	}
	
	getChildren() {
		return [];
	}
	
	getMetaData(aField) {
		return null;
	}
	
	getSingleMetaData(aField) {
		return null;
	}
	
	getLanguageLink(aLanguageCode) {
		//METODO
		return null;
	}
	
	getAcfData() {
		//console.log("wprr/wp/postdata/ItemPostData::getAcfData");
		//console.log(this._data);
		
		return null;
	}
	
	getAcfSubfieldData(aStartObject) {
		return null;
	}
	
	getTaxonomyMap(aTermsArray) {
		
		var returnObject = new Object();
		
		if(aTermsArray) {
			var currentArray = aTermsArray;
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentData = currentArray[i];
				returnObject[currentData.slug] = currentData.name;
			}
		}
		else {
			console.warn("Terms array is not set");
		}
		
		return returnObject;
	}
	
	getAddOnsData(aField) {
		return null;
	}
	
	getFirstObjectInArray(aArray) {
		if(aArray && aArray.length > 0) {
			return aArray[0];
		}
		return null;
	}
	
	getRowIndexByFieldValue(aRows, aFieldName, aValue) {
		return -1;
	}
	
	getRowByFieldValue(aRows, aFieldName, aValue) {
		return null;
	}
	
	getTerms(aTaxonomy) {
		//METODO
		return [];
	}
	
	getPrimaryTerm(aTaxonomy) {
		//console.log("wprr/wp/postdata/ItemPostData::getPrimaryTerm");
		
		return null;
	}
	
	getSelectedTerm(aTaxonomy, aMetaName) {
		//METODO
		return null;
	}
	
	hasTermSlug(aSlug, aTaxonomy) {
		//METODO
		return false;
	}
	
	getTermById(aId, aTaxonomy) {
		//METODO
		return null;
	}
	
	getRelations(aRelationType) {
		return null;
	}
	
	getSingleRelation(aRelationType) {
		return null;
	}
	
	hasSpecificRelation(aRelationType) {
		return null;
	}
	
	static create(aItem) {
		var newItemPostData = new ItemPostData();
		
		newItemPostData.setItemConnection(aItem);
		
		return newItemPostData
	}
}