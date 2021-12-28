import Wprr from "wprr/Wprr";
import React from "react";
import objectPath from "object-path";

// import Project from "wprr/utils/project/Project";
export default class Project {
	
	constructor() {
		this._name = null;
		this._mainReferences = null;
		this._items = new Wprr.utils.data.MultiTypeItemsGroup();
		this._items.setProject(this);
		
		let projectItem = this._items.getItem("project");
		projectItem.addType("controller", this);
		
		let pathsItem = this._items.createInternalItem();
		
		let pathController = Wprr.utils.data.multitypeitems.controllers.paths.PathController.create(pathsItem);
		
		projectItem.addSingleLink("paths", pathsItem.id);
		
		pathController.setFullPath("");
		
		let pathCustomizerItem = this._items.createInternalItem();
		
		let pathCustomizer = Wprr.utils.data.multitypeitems.controllers.paths.PathCustomizer.create(pathCustomizerItem);
		pathCustomizerItem.addSingleLink("paths", pathsItem.id);
		
		projectItem.addSingleLink("pathCustomizer", pathCustomizerItem.id);
		
		let trackingItem = this._items.createInternalItem();
		
		let trackingController = Wprr.utils.data.multitypeitems.controllers.tracking.TrackingController.create(trackingItem);
		
		projectItem.addSingleLink("tracking", trackingItem.id);
		
		let itemsSetupItem = this._items.getItem("itemsSetup");
		let typeLinks = itemsSetupItem.getNamedLinks("types");
		
		this._items.addSetup("dataRangeLoader", Wprr.utils.data.multitypeitems.setup.DataRangeLoader.prepare, Wprr.utils.data.multitypeitems.setup.DataRangeLoader.setup);
		this._items.addSetup("featuredImage", Wprr.utils.data.multitypeitems.setup.FeaturedImage.prepare, Wprr.utils.data.multitypeitems.setup.FeaturedImage.setup);
		this._items.addSetup("image", Wprr.utils.data.multitypeitems.setup.Image.prepare, Wprr.utils.data.multitypeitems.setup.Image.setup);
		this._items.addSetup("permalink", Wprr.utils.data.multitypeitems.setup.Permalink.prepare, Wprr.utils.data.multitypeitems.setup.Permalink.setup);
		this._items.addSetup("taxonomyTerm", Wprr.utils.data.multitypeitems.setup.TaxonomyTerm.prepare, Wprr.utils.data.multitypeitems.setup.TaxonomyTerm.setup);
		this._items.addSetup("menuItem", Wprr.utils.data.multitypeitems.setup.MenuItem.prepare, Wprr.utils.data.multitypeitems.setup.MenuItem.setup);
		this._items.addSetup("relation", Wprr.utils.data.multitypeitems.setup.Relation.prepare, Wprr.utils.data.multitypeitems.setup.Relation.setup);
		this._items.addSetup("relations", Wprr.utils.data.multitypeitems.setup.Relations.prepare, Wprr.utils.data.multitypeitems.setup.Relations.setup);
		this._items.addSetup("objectTypes", Wprr.utils.data.multitypeitems.setup.ObjectTypes.prepare, Wprr.utils.data.multitypeitems.setup.ObjectTypes.setup);
		this._items.addSetup("fields", Wprr.utils.data.multitypeitems.setup.Fields.prepare, Wprr.utils.data.multitypeitems.setup.Fields.setup);
		this._items.addSetup("fieldsStructure", Wprr.utils.data.multitypeitems.setup.FieldsStructure.prepare, Wprr.utils.data.multitypeitems.setup.FieldsStructure.setup);
		this._items.addSetup("fieldTemplate", Wprr.utils.data.multitypeitems.setup.FieldTemplate.prepare, Wprr.utils.data.multitypeitems.setup.FieldTemplate.setup);
		this._items.addSetup("fieldTemplate/relation", Wprr.utils.data.multitypeitems.setup.fieldtemplatetypes.Relation.prepare, Wprr.utils.data.multitypeitems.setup.fieldtemplatetypes.Relation.setup);
		this._items.addSetup("postTitle", Wprr.utils.data.multitypeitems.setup.PostTitle.prepare, Wprr.utils.data.multitypeitems.setup.PostTitle.setup);
		this._items.addSetup("postStatus", Wprr.utils.data.multitypeitems.setup.PostStatus.prepare, Wprr.utils.data.multitypeitems.setup.PostStatus.setup);
		this._items.addSetup("taxonomy", Wprr.utils.data.multitypeitems.setup.Taxonomy.prepare, Wprr.utils.data.multitypeitems.setup.Taxonomy.setup);
		this._items.addSetup("type", Wprr.utils.data.multitypeitems.setup.Type.prepare, Wprr.utils.data.multitypeitems.setup.Type.setup);
		this._items.addSetup("user", Wprr.utils.data.multitypeitems.setup.User.prepare, Wprr.utils.data.multitypeitems.setup.User.setup);
		
		let relationEditors = this._items.getItem("admin/editorsForType/object-relation");
		
		{
			let currentEditor = this._items.getItem("admin/itemEditors/relationHeader");
			currentEditor.setValue("element", React.createElement(Wprr.layout.admin.item.editors.RelationHeader, null));
			relationEditors.getLinks("elements").addItem(currentEditor.id);
		}
		
		{
			let currentEditor = this._items.getItem("admin/itemEditors/postApiCommand");
			currentEditor.setValue("element", React.createElement(Wprr.layout.admin.item.editors.PostApiCommand, null));
			relationEditors.getLinks("elements").addItem(currentEditor.id);
		}
		
		let defaultEditors = this._items.getItem("admin/defaultItemEditors");
		
		{
			let currentEditor = this._items.getItem("admin/itemEditors/itemHeader");
			currentEditor.setValue("element", React.createElement(Wprr.layout.admin.item.editors.ItemHeader, null));
			defaultEditors.getLinks("elements").addItem(currentEditor.id);
		}
		
		{
			let currentEditor = this._items.getItem("admin/itemEditors/postApiCommand");
			currentEditor.setValue("element", React.createElement(Wprr.layout.admin.item.editors.PostApiCommand, null));
			defaultEditors.getLinks("elements").addItem(currentEditor.id);
		}
		
		{
			let currentEditor = this._items.getItem("admin/itemEditors/relationLinks");
			currentEditor.setValue("element", React.createElement(Wprr.layout.admin.item.editors.RelationLinks, null));
			defaultEditors.getLinks("elements").addItem(currentEditor.id);
		}
	}
	
	get name() {
		return this._name;
	}
	
	get mainReferences() {
		return this._mainReferences;
	}
	
	get items() {
		return this._items;
	}
	
	get tracking() {
		return Wprr.objectPath(this.items, "project.tracking.linkedItem.trackingController");
	}
	
	setName(aName) {
		this._name = aName;
		
		return this;
	}
	
	setMainReferences(aReferences) {
		this._mainReferences = aReferences;
		
		return this;
	}
	
	getTextManager() {
		return this._mainReferences.getObject("wprr/textManager");
	}
	
	getWprrUrl(aUrl, aLocation = "rest") {
		let urlResolver = this._mainReferences.getObject("urlResolver/" + aLocation);
		
		if(!urlResolver) {
			console.warn("No path for location " + aLocation);
			return aUrl;
		}
		
		return urlResolver.resolveUrl(aUrl, aLocation);
	}
	
	getLoader() {
		let loader = new Wprr.utils.JsonLoader();
		
		this.addUserCredentialsToLoader(loader);
		
		return loader;
	}
	
	getCreateLoader(aPostType = "dbm_data", aDataType = "none", aCreationMethod = "draft", aTitle = "New item") {
		let loader = new Wprr.utils.loading.CreateLoader();
		
		loader.setUrl(this.getWprrUrl(Wprr.utils.wprrUrl.getCreateUrl(aPostType)));
		loader.changeData.setTitle(aTitle);
		loader.changeData.addSetting("dataType", aDataType);
		loader.changeData.addSetting("creationMethod", aCreationMethod);
		this.addUserCredentialsToLoader(loader);
		
		return loader;
	}
	
	getEditLoader(aId) {
		let loader = new Wprr.utils.loading.EditLoader();
		
		loader.setUrl(this.getWprrUrl(Wprr.utils.wprrUrl.getEditUrl(aId)));
		this.addUserCredentialsToLoader(loader);
		
		return loader;
	}
	
	getActionLoader(aActionName, aData = null) {
		let loader = this.getLoader();
		
		loader.setUrl(this.getWprrUrl(Wprr.utils.wprrUrl.getActionUrl(aActionName)));
		loader.setMethod("POST");
		
		if(aData) {
			loader.setJsonPostBody(aData);
		}
		
		return loader;
	}
	
	getLoginLoader(aLogin, aPassword, aRemember = false) {
		let loader = this.getActionLoader("login");
		loader.setJsonPostBody({
			"log": aLogin,
			"pwd": aPassword,
			"remember": aRemember,
		});
		
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this._callback_loginDataLoaded, [Wprr.sourceEvent("data")]));
		
		return loader;
	}
	
	_callback_loginDataLoaded(aData) {
		//console.log("_callback_loginDataLoaded");
		if(aData.authenticated) {
			this.setUserData({"restNonce": aData["restNonce"], "restNonceGeneratedAt": aData["restNonceGeneratedAt"], "roles": aData["roles"], "data": aData["user"]});
		}
	}
	
	getLogoutLoader() {
		let loader = this.getActionLoader("logout");
		
		loader.setJsonPostBody({});
		
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this.setUserData, [null]));
		
		return loader;
	}
	
	getSignupLoader(aData) {
		let loader = this.getActionLoader("register-user");
		
		loader.setJsonPostBody(aData);
		
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this._callback_signupDataLoaded, [Wprr.sourceEvent("data")]));
		
		return loader;
	}
	
	_callback_signupDataLoaded(aData) {
		//console.log("_callback_loginDataLoaded");
		//console.log(aData);
		
		if(aData.registered) {
			this.setUserData({"restNonce": aData["restNonce"], "restNonceGeneratedAt": aData["restNonceGeneratedAt"], "roles": aData["roles"], "data": aData["user"]});
		}
	}
	
	getSharedLoader(aUrl) {
		//console.log("getSharedLoader");
		//console.log(aUrl, this._items);
		
		let pathController = Wprr.objectPath(this.items, "project.paths.linkedItem.children.wp.children.rest.pathController");
		
		let absolutePath = pathController.resolveRelativePath(aUrl);
		let item = this._items.getItem(absolutePath);
		
		if(!item.hasType("loader")) {
			let loader = new Wprr.utils.loading.JsonLoader();
			loader.setUrl(absolutePath);
			this.addUserCredentialsToLoader(loader);
			item.requireValue("loaded", false);
			item.requireValue("data", null);
			loader.addSuccessCommand(Wprr.commands.setProperty(item.getType("data").reSource(), "value", Wprr.sourceEvent("data")));
			loader.addSuccessCommand(Wprr.commands.setProperty(item.getType("loaded").reSource(), "value", true));
			
			item.addType("loader", loader);
			
			
			//METODO: remove this legacy
			let storeController = this._mainReferences.getObject("redux/store/wprrController");
			storeController.addLoader(absolutePath, loader);
		}
		
		return item.getType("loader");
	}
	
	addUserCredentialsToLoader(aLoader) {
		
		//METODO: move this to tree
		let userData = this._mainReferences.getObject("wprr/userData");
		if(userData) {
			aLoader.addHeader("X-WP-Nonce", userData.restNonce);
		}
		
		return aLoader;
	}
	
	setUserData(aData) {
		//console.log("setUserData");
		//console.log(aData);
		
		//METODO: move this to tree
		let storeController = this._mainReferences.getObject("redux/store/wprrController");
		this._mainReferences.addObject("wprr/userData", aData);
		storeController.setUser(aData);
		
		return this;
	}
	
	getUserData() {
		return this._mainReferences.getObject("wprr/userData");
	}
	
	getCurrentLanguage() {
		return objectPath.get(this._mainReferences.getObject("wprr/pageData"), "queryData.language");
	}
}