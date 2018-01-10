import objectPath from "object-path";

// import WpUrlFunctions from "wprr/wp/WpUrlFunctions";
export default class WpUrlFunctions {
	
	static getPaginationIndexFromUrl(aUrl) {
		let regExpMatch = aUrl.match(WpUrlFunctions.PAGINATION_REG_EXP);
		
		if(regExpMatch) {
			return regExpMatch[3];
		}
		
		return 1;
	}
	
	static getPageInPagination(aInitialUrl, aPageIndex) {
		//console.log("wprr/wp/WpUrlFunctions::getPageInPagination");
		
		//METODO: fix to get the first page of the pagination
		
		let newUrl = null;
		let currentUrl = aInitialUrl;
		let pageRegExp = WpUrlFunctions.PAGINATION_REG_EXP;
		
		if(aPageIndex === 1) {
			if(pageRegExp.test(currentUrl)) {
				newUrl = currentUrl.replace(pageRegExp, "$1$4");
			}
			else {
				newUrl = currentUrl;
			}
		}
		else {
			if(pageRegExp.test(currentUrl)) {
				newUrl = currentUrl.replace(pageRegExp, "$1$2/" + aPageIndex + "/$4");
			}
			else {
				var pageAddRegExp = new RegExp("^([^\\?#]*)(.*)$");
				newUrl = currentUrl.replace(pageAddRegExp, "$1page/" + aPageIndex + "/$2");
			}
		}
	
		
	
		return newUrl;
	}
}

WpUrlFunctions.PAGINATION_REG_EXP = new RegExp("^(.*/)(page)(/[0-9]+/?)(.*)$");