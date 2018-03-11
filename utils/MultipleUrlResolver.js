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
		this._basePaths = aBasePaths;
		
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
			return this._basePaths[aRealtiveTo] + "/" + aPath;
		}
		return aPath;
	}
}