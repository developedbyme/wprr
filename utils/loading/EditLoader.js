import Wprr from "wprr/Wprr";
import JsonLoader from "./JsonLoader";

// import EditLoader from "wprr/utils/loading/EditLoader";
/**
 * Loader that loads json data from a change data
 */
export default class EditLoader extends JsonLoader {
	
	/**
	 * Contructor
	 */
	constructor() {
		super();
		
		this._method = "POST";
		this.addHeader("Content-Type", "application/json");
		
		this._changeData = new Wprr.utils.wp.admin.ChangeData();
	}
	
	get changeData() {
		return this._changeData;
	}
	
	_prepareLoad() {
		super._prepareLoad();
		
		this.setBody(this._changeData.getEditData());
		
		return this;
	}
}