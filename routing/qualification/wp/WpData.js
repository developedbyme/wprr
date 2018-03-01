import objectPath from "object-path";

import Qualification from "wprr/routing/qualification/Qualification";

//import WpData from "wprr/routing/qualification/wp/WpData";
/**
 * Qualification that checks a WP conditional.
 */
export default class WpData extends Qualification {
	
	/**
	 * Constructor
	 */
	constructor() {
		super();
		
		this._path = null;
		this._matchValue = true;
	}
	
	/**
	 * Sets the path of the data to check.
	 * 
	 * @param	aPath	String	The path to check.
	 *
	 * @return	WpData	self
	 */
	setDataPath(aPath) {
		this._path = aPath;
		
		return this;
	}
	
	/**
	 * Sets the matching value for the data
	 *
	 * @param	aValue	*	The value that the data should match
	 *
	 * @return	WpData	self
	 */
	setMatchValue(aValue) {
		this._matchValue = aValue;
	}
	
	/**
	 * Evaluates if this qualification meets the correct criteria, which it does if the conditional tag is set to true.
	 *
	 * @param	aData	*	The data that needs to meet the correct criteria.
	 *
	 * @return	Boolean	The result of the evalutation. Always true.
	 */
	qualify(aData) {
		console.log("wprr/routing/qualification/wp/WpData::qualify");
		console.log(aData);
		
		let path = this._path;
		
		let checkValue = objectPath.get(aData, path);
		
		return (checkValue === this._matchValue); 
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aPath		String	The path to the data to check.
	 * @param	aMatchValue	*		The value that the data should match.
	 *
	 * @return	WpData	The new instance
	 */
	static create(aPath, aMatchValue) {
		let newWpData = new WpData();
		newWpData.setDataPath(aPath);
		newWpData.setMatchValue(aMatchValue);
		
		return newWpData;
	}
	
	/**
	 * Creates a new instance of this class. 
	 *
	 * @param	aTemplateName	String	The name of the WP page template that should be matched.
	 *
	 * @return	WpData	The new instance
	 */
	static createForPageTemplate(aTemplateName) {
		let newWpData = new WpData();
		newWpData.setDataPath("queriedData.meta._wp_page_template.0");
		newWpData.setMatchValue(aTemplateName);
		
		return newWpData;
	}
	
	/**
	 * Creates a new instance of this class. 
	 *
	 * @param	aPostType	String	The name of the WP post type that should be matched.
	 *
	 * @return	WpData	The new instance
	 */
	static createForPostType(aPostType) {
		let newWpData = new WpData();
		newWpData.setDataPath("templateSelection.post_type");
		newWpData.setMatchValue(aPostType);
		
		return newWpData;
	}
}