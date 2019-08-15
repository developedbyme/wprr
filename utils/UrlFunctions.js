//import UrlFunctions from "wprr/utils/UrlFunctions";
export default class UrlFunctions {
	
	static getCleanUrl(aUrl) {
		
		let url = aUrl;
		
		let questionMarkIndex = url.indexOf("?");
		if(questionMarkIndex !== -1) {
			url = url.substring(0, questionMarkIndex);
		}
		
		let hashIndex = url.indexOf("#");
		if(hashIndex !== -1) {
			url = url.substring(0, hashIndex);
		}
		
		return url;
	}
	
	static addQueryString(aBaseUrl, aKey, aValue) {
		
		let url = aBaseUrl;
		let hash = "";
		
		let hashIndex = aBaseUrl.indexOf("#");
		if(hashIndex !== -1) {
			hash = url.substring(hashIndex, url.length);
			url = url.substring(0, hashIndex);
		}
		
		let questionMarkIndex = url.indexOf("?");
		if(questionMarkIndex !== -1) {
			url += "&";
		}
		else {
			url += "?";
		}
		
		url += encodeURIComponent(aKey) + "=" + encodeURIComponent(aValue);
		
		return url + hash;
	}
}