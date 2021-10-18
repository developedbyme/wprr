import Wprr from "wprr/Wprr";
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
		console.log("_callback_loginDataLoaded");
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
		console.log("_callback_loginDataLoaded");
		console.log(aData);
		
		if(aData.registered) {
			this.setUserData({"restNonce": aData["restNonce"], "restNonceGeneratedAt": aData["restNonceGeneratedAt"], "roles": aData["roles"], "data": aData["user"]});
		}
	}
	
	getSharedLoader(aUrl) {
		let storeController = this._mainReferences.getObject("redux/store/wprrController");
		
		return storeController.getLoaderByRelativePath(aUrl);
	}
	
	addUserCredentialsToLoader(aLoader) {
		
		let userData = this._mainReferences.getObject("wprr/userData");
		if(userData) {
			aLoader.addHeader("X-WP-Nonce", userData.restNonce);
		}
		
		return aLoader;
	}
	
	setUserData(aData) {
		console.log("setUserData");
		console.log(aData);
		
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