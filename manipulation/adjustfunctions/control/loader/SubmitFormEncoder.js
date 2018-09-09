import ControlFunction from "wprr/manipulation/adjustfunctions/control/ControlFunction";

import SourceData from "wprr/reference/SourceData";

//import SubmitFormEncoder from "wprr/manipulation/adjustfunctions/control/loader/SubmitFormEncoder";
export default class SubmitFormEncoder extends ControlFunction {

	constructor() {
		super();
		
		this.setInput("encode", SourceData.create("prop", "encode"));
		this.setInput("triggerName", "urlRequest/request");
		
		this._callback_onSubmitBound = this._callback_onSubmit.bind(this);
	}
	
	_callback_onSubmit(aEventOrNull, aForm) {
		console.log("wprr/manipulation/adjustfunctions/control/loader/SubmitFormEncoder::_callback_onSubmit");
		
		if(aEventOrNull) {
			aEventOrNull.preventDefault();
		}
		
		let encode = this.getInputFromSingleOwner("encode");
		
		let submitData = aForm.getFormData();
		
		if(encode) {
			submitData = encode(submitData, this.getSingleOwner());
		}
		
		let triggerName = this.getInputFromSingleOwner("triggerName");
		
		let currentArray = this._owners;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentOwner = currentArray[i];
			let triggerController = currentOwner.getReference("trigger/" + triggerName);
			if(triggerController) {
				triggerController.trigger(triggerName, submitData);
			}
		}
	}
	
	/**
	 * Adjusts data. This function should be overridden by classes extending from this base object.
	 *
	 * @param	aData				*				The data to adjust
	 * @param	aManipulationObject	WprrBaseObject	The manipulation object that is performing the adjustment. Used to resolve sourcing.
	 *
	 * @return	*	The modified data
	 */
	adjust(aData, aManipulationObject) {
		console.log("wprr/manipulation/adjustfunctions/control/loader/SubmitFormEncoder::adjust");
		
		//METODO: source cleanup
		aData["onSubmit"] = this._callback_onSubmitBound;
		
		return aData;
	}
	
	static create(aEncode) {
		let newSubmitFormEncoder = new SubmitFormEncoder();
		
		newSubmitFormEncoder.setInputWithoutNull("encode", aEncode);
		
		return newSubmitFormEncoder;
	}
}
