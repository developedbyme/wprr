import objectPath from "object-path";

// import WprrUrlFunctions from "wprr/wp/WprrUrlFunctions";
export default class WprrUrlFunctions {
	
	static getBasePath() {
		return "wprr/v1/";
	}
	
	static _getParametersString(aParameters) {
		if(aParameters) {
			if(Array.isArray(aParameters)) {
				return aParameters.join("&");
			}
			else if(typeof(aParameters) === "object") {
				let parametersArray = new Array();
				for(let objectName in aParameters) {
					parametersArray.push(encodeURIComponent(objectName) + "=" + encodeURIComponent(aParameters[objectName]));
				}
				return parametersArray.join("&");
			}
			else {
				return aParameters;
			}
		}
		
		return null;
	}
	
	static _addParametersString(aBaseUrl, aParametersString) {
		if(!aParametersString) {
			return aBaseUrl;
		}
		
		let separator = (aBaseUrl.indexOf("?") === -1) ? "?" : "&";
		
		return aBaseUrl + separator + aParametersString;
	}
	
	static _getRangePathWithoutType(aPostType = "page", aSelections = "default", aEncodings = "default", aParameters = null) {
		
		let returnUrl = aPostType + "/";
		
		if(Array.isArray(aSelections)) {
			returnUrl += aSelections.join(",");
		}
		else {
			returnUrl += aSelections;
		}
		
		returnUrl += "/";
		
		if(Array.isArray(aEncodings)) {
			returnUrl += aEncodings.join(",");
		}
		else {
			returnUrl += aEncodings;
		}
		
		returnUrl = WprrUrlFunctions._addParametersString(returnUrl, WprrUrlFunctions._getParametersString(aParameters));
		
		return returnUrl;
	}
	
	static getRangeUrl(aPostType = "page", aSelections = "default", aEncodings = "default", aParameters = null) {
		
		let returnUrl = this.getBasePath(this.getBasePath());
		
		returnUrl += "range/" + WprrUrlFunctions._getRangePathWithoutType(aPostType, aSelections, aEncodings, aParameters);
		
		return returnUrl;
	}
	
	static getRangeItemUrl(aPostType = "page", aSelections = "default", aEncodings = "default", aParameters = null) {
		
		let returnUrl = this.getBasePath(this.getBasePath());
		
		returnUrl += "range-item/" + WprrUrlFunctions._getRangePathWithoutType(aPostType, aSelections, aEncodings, aParameters);
		
		return returnUrl;
	}
	
	static getGlobalItemUrl(aType, aParameters = null) {
		
		let returnUrl = this.getBasePath(this.getBasePath());
		
		returnUrl += "global/" + aType;
		returnUrl = WprrUrlFunctions._addParametersString(returnUrl, WprrUrlFunctions._getParametersString(aParameters));
		
		return returnUrl;
	}
	
	static getTermsUrl(aTaxonomy) {
		let returnUrl = this.getBasePath(this.getBasePath());
		
		returnUrl += "taxonomy/" + aTaxonomy + "/terms";
		
		return returnUrl;
	}
	
	static getCartUrl() {
		let returnUrl = this.getBasePath(this.getBasePath());
		
		returnUrl += "global/woocommerce/cart";
		
		return returnUrl;
	}
	
	static getActionUrl(aAction) {
		let returnUrl = this.getBasePath(this.getBasePath());
		
		returnUrl += "action/" + aAction;
		
		return returnUrl;
	}
	
	static getPostUrl(aId) {
		let returnUrl = this.getBasePath(this.getBasePath());
		
		returnUrl += "post/" + aId;
		
		return returnUrl;
	}
}