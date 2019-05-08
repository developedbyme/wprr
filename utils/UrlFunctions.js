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
}