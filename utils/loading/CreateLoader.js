import Wprr from "wprr/Wprr";
import JsonLoader from "./JsonLoader";

// import CreateLoader from "wprr/utils/loading/CreateLoader";
/**
 * Loader that loads json data from a change data with creation
 */
export default class CreateLoader extends JsonLoader {
	
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
	
	setChangeData(aChangeData) {
		this._changeData = aChangeData;
		
		return this;
	}
	
	_prepareLoad() {
		super._prepareLoad();
		
		this.setBody(this._changeData.getCreateData());
		
		return this;
	}
}