import Wprr from "wprr/Wprr";
import React from "react";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

export default class PathController extends MultiTypeItemConnection {
	
	constructor() {
		
		super();
		
	}
	
	setup() {
		
		this.item.addSingleLink("parent", null);
		this.item.getNamedLinks("children");
		this.item.requireValue("slug", null);
		this.item.requireValue("fullPath", null);
		
		return this;
	}
	
	setupForItem(aItem) {
		aItem.addType("pathController", this);
		this.setup();
		
		return this;
	}
	
	setSlug(aName) {
		this.item.setValue("slug", aName);
		
		return this;
	}
	
	addQueryStringToSlug(aKey, aValue) {
		let slug = this.item.getValue("slug");
		
		slug += (slug.indexOf("?") >= 0) ? "&" : "?";
		
		slug += aKey + "=" + aValue;
		
		this.item.setValue("slug", slug);
		
		return this;
	}
	
	setFullPath(aPath) {
		this.item.setValue("fullPath", aPath);
		
		return this;
	}
	
	generateFullPath() {
		//console.log("generateFullPath");
		
		let parent = Wprr.objectPath(this.item, "parent.linkedItem.pathController");
		
		let fullPath = this.item.getValue("slug");
		if(parent) {
			let parentPath = parent.getFullPath();
			if(parentPath) {
				if(fullPath && !(fullPath[0] === "(" && fullPath[fullPath.length-1] === ")")) {
					let queryStringIndex = parentPath.indexOf("?");
					if(queryStringIndex !== -1) {
						parentPath = parentPath.substring(0, queryStringIndex);
					}
					fullPath = parentPath + "/" + fullPath;
				}
				else {
					fullPath = parentPath;
				}
			}
			
		}
		
		this.setFullPath(fullPath);
		
		return fullPath;
	}
	
	getFullPath() {
		//console.log("getFullPath");
		
		let fullPath = this.item.getValue("fullPath");
		if(!fullPath) {
			fullPath = this.generateFullPath();
		}
		
		return fullPath;
	}
	
	getChild(aPath) {
		let subpathIndex = aPath.indexOf("/");
		let path = aPath;
		let subpath = null;
		if(subpathIndex > 0) {
			path = aPath.substring(0, subpathIndex);
			subpath = aPath.substring(subpathIndex+1, aPath.length);
		}
		
		let children = this.item.getNamedLinks("children");
		
		if(!children.hasLinkByName(path)) {
			let newChild = this.item.group.createInternalItem();
		
			Wprr.utils.data.multitypeitems.controllers.paths.PathController.create(newChild);
			newChild.setValue("slug", path);
			newChild.getType("parent").id = this.item.id;
			
			children.addItem(path, newChild.id);
		}
		
		let link = children.getLinkByName(path).getType("pathController");
		
		if(subpath) {
			link = link.getChild(subpath);
		}
		
		return link;
	}
	
	hasObjectPathHandling() {
		return true;
	}
	
	getValueForPath(aPath) {
		//console.log("PathController::getValueForPath");
		//console.log(aPath);
		
		let tempArray = ("" + aPath).split(".");
		let firstPart = tempArray.shift();
		let restParts = tempArray.join(".");
		
		switch(firstPart) {
			case "item":
				return Wprr.objectPath(this[firstPart], restParts);
			case "fullPath":
				return this.getFullPath();
		}
		
		return Wprr.objectPath(this.getChild(firstPart), restParts);
	}
	
	resolveRelativePath(aPath) {
		let urlResolver = Wprr.utils.UrlResolver.create(this.getFullPath());
		
		return urlResolver.getAbsolutePath(aPath);
	}
	
	toJSON() {
		return "[PathController id=" + this._id + "]";
	}
	
	static create(aItem) {
		let newPathController = new PathController();
		
		newPathController.setupForItem(aItem);
		
		return newPathController;
	}
}