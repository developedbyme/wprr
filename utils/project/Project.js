import Wprr from "wprr/Wprr";
import objectPath from "object-path";

// import Project from "wprr/utils/project/Project";
export default class Project {
	
	constructor() {
		this._name = null;
		this._mainReferences = null;
	}
	
	get name() {
		return this._name;
	}
	
	get mainReferences() {
		return this._mainReferences;
	}
	
	setName(aName) {
		this._name = aName;
		
		return this;
	}
	
	setMainReferences(aReferecnes) {
		this._mainReferences = aReferecnes;
		
		return this;
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
		let loader = new Wprr.utils.loading.EditLoader();
		
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
	
	getActionLoader(aActionName) {
		let loader = this.getLoader();
		
		loader.setUrl(this.getWprrUrl(Wprr.utils.wprrUrl.getActionUrl(aActionName)));
		loader.setMethod("POST");
		
		return loader;
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
		let storeController = this._mainReferences.getObject("redux/store/wprrController");
		this._mainReferences.addObject("wprr/userData", aData);
		storeController.setUser(aData);
		
		return this;
	}
	
	getCurrentLanguage() {
		return objectPath.get(this._mainReferences.getObject("wprr/pageData"), "queryData.language");
	}
}