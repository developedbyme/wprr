import UrlResolver from "wprr/utils/UrlResolver";

// import MultipleUrlResolver from "wprr/utils/MultipleUrlResolver";
/**
 * Resolves urls depending on what they should be related to
 */
export default class MultipleUrlResolver {
	
	/**
	 * Contructor
	 */
	constructor() {
		this._basePaths = new Object();
	}
	
	setBasePaths(aBasePaths) {
		for(let objectName in aBasePaths) {
			this._basePaths[objectName] = UrlResolver.create(aBasePaths[objectName]);
		}
		
		return this;
	}
	
	addBasePath(aName, aPath) {
		this._basePaths[aName] = UrlResolver.create(aPath);
		
		return this;
	}
	
	addPathsToReferenceInjectionData(aData) {
		
		let prefix = "urlResolver/";
		
		for(let objectName in this._basePaths) {
			aData[prefix + objectName] = this;
		}
	}
	
	resolveUrl(aPath, aRealtiveTo) {
		//console.log("wprr/utils/MultipleUrlResolver");
		
		//METODO: do a relative resolve
		if(this._basePaths && this._basePaths[aRealtiveTo] != undefined) {
			return this._basePaths[aRealtiveTo].getAbsolutePath(aPath);
		}
		console.warn("Resolver doesn't have any base for " + aRealtiveTo, this);
		return aPath;
	}
	
	getBaseUrl(aRealtiveTo) {
		if(this._basePaths && this._basePaths[aRealtiveTo] != undefined) {
			return this._basePaths[aRealtiveTo].getAbsolutePath("");
		}
		console.warn("Resulver doesn't have any base for " + aRealtiveTo, this);
		return null;
	}
}