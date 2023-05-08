// import UrlResolver from "wprr/utils/UrlResolver";
/**
 * Resolver for relative file paths.
 */
export default class UrlResolver  {
	
	/**
	 * Constructor
	 */
	constructor() {
		
		this._basePath = "";
		this._folderNamesArray = new Array();
	};
	
	/**
	 * Sets up the base url for where paths should be resolved.
	 *
	 * @param	aBasePath	String	The base part of the URL (eg. http://www.example.com).
	 * @param	aFolders	String	The path to the current folder (eg. path/to/folder).
	 */
	setupBaseUrl(aBasePath, aFolders) {
		this._basePath = aBasePath;
		if(aFolders !== null) {
			this._folderNamesArray = aFolders.split("/");
		}
	}
	
	setupBaseUrlFromPath(aPath) {
		//console.log("wprr/utils/UrlResolver::setupBaseUrlFromPath");
		//console.log(aPath);
		
		if(aPath.lastIndexOf("/") === aPath.length - 1) {
			aPath = aPath.substring(0, aPath.length - 1);
		}
		let colonSlashSlashIndex = aPath.indexOf("://");
		let basePathEndIndex;
		if(colonSlashSlashIndex > -1) {
			basePathEndIndex = aPath.indexOf("/", colonSlashSlashIndex + 3);
		}
		else {
			basePathEndIndex = aPath.indexOf("/");
		}
		
		if(basePathEndIndex === -1) {
			this._basePath = aPath;
			this._folderNamesArray = new Array();
		}
		else if(basePathEndIndex === 0) {
			this._basePath = "";
			aPath = aPath.substring(basePathEndIndex, aPath.length);
			this._folderNamesArray = aPath.split("/");
		}
		else {
			this._basePath = aPath.substring(0, basePathEndIndex);
			aPath = aPath.substring(basePathEndIndex + 1, aPath.length);
			this._folderNamesArray = aPath.split("/");
		}
	}
	
	setupBaseUrlFromFilePath(aPath) {
		let questionMarkPosition = aPath.indexOf("?");
		let anchorMarkPosition = aPath.indexOf("#");
		let removeEndPosition = -1;
		if(questionMarkPosition > -1) {
			removeEndPosition = questionMarkPosition;
		}
		if(anchorMarkPosition > -1) {
			if((removeEndPosition === -1) || (anchorMarkPosition < removeEndPosition)) {
				removeEndPosition = anchorMarkPosition;
			}
		}
		
		if(removeEndPosition !== -1) {
			aPath = aPath.substring(0, removeEndPosition);
		}
		let slashPosition = aPath.lastIndexOf("/");
		if(slashPosition !== -1) {
			aPath = aPath.substring(0, slashPosition);
		}
		this.setupBaseUrlFromPath(aPath);
	}
	
	getAbsolutePath(aPath) {
		if(aPath === null) {
			//METODO: error message
			return null;
		}
		
		if(aPath === "") {
			let returnPath = (this._basePath) ? this._basePath + "/" : "";
			return returnPath + this._folderNamesArray.join("/");
		}
		
		if(aPath.indexOf("/") === 0) {
			//MENOTE: aPath is relative to base of url
			if(!this._basePath) {
				return aPath.substring(1, aPath.length);
			}
			else if(this._basePath.indexOf("://") > -1) {
				return this._basePath + aPath;
			}
			else {
				return aPath;
			}
		}
		
		let colonSlashSlashIndex = aPath.indexOf("://");
		if(colonSlashSlashIndex > -1) {
			let questionMarkPosition = aPath.indexOf("?");
			if((questionMarkPosition === -1) || (colonSlashSlashIndex < questionMarkPosition)) {
				return aPath;
			}
		}
		
		let endNr = this._folderNamesArray.length;
		
		let finalPath = aPath;
		if(finalPath.indexOf("../") === 0) {
			while(finalPath.indexOf("../") === 0) {
				endNr--;
				finalPath = finalPath.substring(3, finalPath.length);
			}
		}
		let returnPath = (this._basePath) ? this._basePath + "/" : "";
		if(this._folderNamesArray.length > 0) {
			let currentArray = this._folderNamesArray;
			for(let i = 0;i < endNr; i++) {
				returnPath += currentArray[i] + "/";
			}
		}
		returnPath += finalPath;
		return returnPath;
	}
	
	getRelativePath(aPath) {
		
		let workPath = aPath;
		
		if(this._basePath !== "") {
			if(workPath.indexOf(this._basePath) !== 0) {
				//METODO: error message
				return null;
			}
			
			workPath = workPath.substring(this._basePath.length + 1, workPath.length);
		}
		
		let questionMarkPosition = workPath.indexOf("?");
		let queryString = ""; //MENOTE: should include ? if exists
		if(questionMarkPosition !== -1) {
			queryString = workPath.substring(questionMarkPosition, workPath.length);
			workPath = workPath.substring(0, questionMarkPosition);
		}
		
		let returnString = "";
		
		let workPathArray = workPath.split("/");
		let currentArray = this._folderNamesArray;
		let theLength = currentArray.length;
		for(let i = 0; i < theLength; i++) {
			if(workPathArray.length === 0 || workPathArray[0] !== currentArray[i]) {
				returnString += this._getLevelUpPath(theLength - i);
				break;
			} else {
				workPathArray.shift();
			}
		}
		returnString += workPathArray.join("/") + queryString;
		return returnString;
	}
	
	_getLevelUpPath(aLength) {
		let returnString = "";
		for(let i = 0; i < aLength; i++) {
			returnString += "../";
		}
		return returnString;
	}
	
	static create(aPath = null) {
		let newUrlResolver = new UrlResolver();
		if(aPath) {
			newUrlResolver.setupBaseUrlFromPath(aPath);
		}
		return newUrlResolver;
	}
	
	static createFromFilePath(aPath) {
		let newUrlResolver = new UrlResolver();
		newUrlResolver.setupBaseUrlFromFilePath(aPath);
		return newUrlResolver;
	}
}

UrlResolver.tempUrlResolver = new UrlResolver();