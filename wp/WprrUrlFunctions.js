import objectPath from "object-path";

// import WprrUrlFunctions from "wprr/wp/WprrUrlFunctions";
export default class WprrUrlFunctions {
	
	static getBasePath() {
		return "wprr/v1/";
	}
	
	static _getRangePathWithoutType(aPostType = "page", aSelections = "default", aEncodings = "default", aParmeters = null) {
		
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
		
		if(aParmeters) {
			if(Array.isArray(aParmeters)) {
				returnUrl += "?" + aParmeters.join("&");
			}
			else if(typeof(aParmeters) === "object") {
				let parametersArray = new Array();
				for(let objectName in aParmeters) {
					parametersArray.push(encodeURIComponent(objectName) + "=" + encodeURIComponent(aParmeters[objectName]));
				}
				returnUrl += "?" + parametersArray.join("&");
			}
			else {
				returnUrl += "?" + aParmeters;
			}
		}
		
		return returnUrl;
	}
	
	static getRangeUrl(aPostType = "page", aSelections = "default", aEncodings = "default", aParmeters = null) {
		
		let returnUrl = this.getBasePath(this.getBasePath());
		
		returnUrl += "range/" + WprrUrlFunctions._getRangePathWithoutType(aPostType, aSelections, aEncodings, aParmeters);
		
		return returnUrl;
	}
	
	static getRangeItemUrl(aPostType = "page", aSelections = "default", aEncodings = "default", aParmeters = null) {
		
		let returnUrl = this.getBasePath(this.getBasePath());
		
		returnUrl += "range-item/" + WprrUrlFunctions._getRangePathWithoutType(aPostType, aSelections, aEncodings, aParmeters);
		
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
}