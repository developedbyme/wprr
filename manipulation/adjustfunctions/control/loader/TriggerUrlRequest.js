import ControlFunction from "wprr/manipulation/adjustfunctions/control/ControlFunction";

//import TriggerUrlRequest from "wprr/manipulation/adjustfunctions/control/loader/TriggerUrlRequest";
export default class TriggerUrlRequest extends ControlFunction {

	constructor() {
		super();
		
		this.setInput("url", null);
		this.setInput("method", "GET");
		this.setInput("headers", {});
		this.setInput("statusStateName", "urlRequestStatus");
		this.setInput("resultStateName", "urlRequestResult");
		this.setInput("triggerName", "urlRequest/request");
		this.setInput("resultTriggerName", "urlRequest/result");
		this.setInput("errorTriggerName", "urlRequest/error");
		
		this._requestStatus = TriggerUrlRequest.STATUS_NONE;
		this._requestResult = null;
	}
	
	trigger(aName, aValue) {
		console.log("wprr/manipulation/adjustfunctions/control/loader/TriggerUrlRequest::trigger");
		
		if(aName === this.getInputFromSingleOwner("triggerName")) {
			//METODO
			
			console.log(">>>>");
		}
	}
	
	injectReferences(aReturnObject) {
		aReturnObject["trigger/" + this.getInputFromSingleOwner("triggerName")] = this;
	}
	
	_getInitialState() {
		let returnObject = super._getInitialState();
		
		returnObject[this.getInputFromSingleOwner("statusStateName")] = this._requestStatus;
		returnObject[this.getInputFromSingleOwner("resultStateName")] = this._requestResult;
		
		return returnObject;
	}
	
	setStatus(aStatus) {
		
		this._requestStatus = aStatus;
		
		let stateObject = new Object();
		
		stateObject[this.getInputFromSingleOwner("statusStateName")] = this._requestStatus;
		
		this.setState(stateObject);
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
		console.log("wprr/manipulation/adjustfunctions/control/loader/TriggerUrlRequest::adjust");
		
		//MENOTE: do nothing
		
		return aData;
	}
	
	static create(aUrl, aMethod, aHeaders) {
		let newTriggerUrlRequest = new TriggerUrlRequest();
		
		newTriggerUrlRequest.setInputWithoutNull("url", aUrl);
		newTriggerUrlRequest.setInputWithoutNull("method", aMethod);
		newTriggerUrlRequest.setInputWithoutNull("headers", aHeaders);
		
		return newTriggerUrlRequest;
	}
}

TriggerUrlRequest.STATUS_NONE = "none";
TriggerUrlRequest.STATUS_IN_PROGRESS = "inProgress";
TriggerUrlRequest.STATUS_DONE = "done";
TriggerUrlRequest.STATUS_ERROR = "error";
