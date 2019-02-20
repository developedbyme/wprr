import React from "react";

import ReferenceExporter from "wprr/reference/ReferenceExporter";
import ReferenceHolder from "wprr/reference/ReferenceHolder";
import AttributeDataStorage from "wprr/wp/blocks/AttributeDataStorage";

// import ElementBlockRegistration from "wprr/wp/blocks/registration/ElementBlockRegistration";
export default class ElementBlockRegistration {
	
	constructor() {
		//console.log("wprr/wp/blocks/registration/ElementBlockRegistration::constructor");
		
		this._element = null;
		this._registrationData = new Object();
		this._registrationData["attributes"] = new Object();
		
		this._componentName = null;
		
		this._registrationData["edit"] = this.edit.bind(this);
		this._registrationData["save"] = this.save.bind(this);
		
		this.addAttribute("componentData", "object");
		this.addAttribute("adminData", "object");
	}
	
	setElement(aElement) {
		this._element = aElement;
		
		return this;
	}
	
	setComponent(aName) {
		this._componentName = aName;
		
		return this;
	}
	
	setupRegistration(aTitle, aIcon, aCategory) {
		
		this._registrationData["title"] = aTitle;
		this._registrationData["icon"] = aIcon;
		this._registrationData["category"] = aCategory;
		
		return this;
	}
	
	addAttribute(aName, aType = "string") {
		this._registrationData["attributes"][aName] = {
			"type": aType,
		};
		
		return this;
	}
	
	getRegistrationData() {
		
		console.log(this._registrationData);
		
		return this._registrationData;
	}
	
	edit(aProps) {
		console.log("wprr/wp/blocks/registration/ElementBlockRegistration::save");
		
		let referenceHolder = new ReferenceHolder();
		let externalStorage = new AttributeDataStorage();
		
		externalStorage.setupAttributes(aProps.attributes, aProps.setAttributes);
		externalStorage.setPathPrefix("componentData");
		
		let blocksPrefix = "wprr/wpBlockEditor/";
		
		referenceHolder.addObject(blocksPrefix + "attributes", aProps.attributes);
		referenceHolder.addObject(blocksPrefix + "setAttributes", aProps.setAttributes);
		referenceHolder.addObject(blocksPrefix + "externalStorage", externalStorage);
		
		return <ReferenceExporter references={referenceHolder} attributes={aProps.attributes}>
			{this._element}
		</ReferenceExporter>
	}
	
	save(aProps) {
		console.log("wprr/wp/blocks/registration/ElementBlockRegistration::save");
		console.log(aProps);
		
		return <div data-expanded-content="1" data-wprr-component={this._componentName} data-wprr-component-data={JSON.stringify(aProps.attributes.componentData)}></div>;
	}
}