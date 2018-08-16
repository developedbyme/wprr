import ControlFunction from "wprr/manipulation/adjustfunctions/control/ControlFunction";

//import TriggerUrlRequest from "wprr/manipulation/adjustfunctions/control/loader/TriggerUrlRequest";
export default class TriggerUrlRequest extends ControlFunction {

	constructor() {
		super();
		
		this.setInput("url", null);
		this.setInput("method", "GET");
		this.setInput("headers", {});
		this.setInput("repsonseType", "json");
		this.setInput("statusStateName", "urlRequestStatus");
		this.setInput("resultStateName", "urlRequestResult");
		this.setInput("triggerName", "urlRequest/request");
		this.setInput("resultTriggerName", "urlRequest/result");
		this.setInput("errorTriggerName", "urlRequest/error");
		
		this._requestStatus = TriggerUrlRequest.STATUS_NONE;
		this._requestResult = null;
		
		this._responseOk = null;
		
		this._loadPromise = null;
		
		this._promise_loadResponseBound = this._promise_loadResponse.bind(this);
		this._promise_dataEncodedBound = this._promise_dataEncoded.bind(this);
		this._promise_loadingErrorBound = this._promise_loadingError.bind(this);
	}
	
	trigger(aName, aValue) {
		console.log("wprr/manipulation/adjustfunctions/control/loader/TriggerUrlRequest::trigger");
		
		if(aName === this.getInputFromSingleOwner("triggerName")) {
			
			let bodyData = aValue;
			
			if(!(aValue instanceof String)) {
				bodyData = JSON.stringify(aValue);
			}

			this._loadPromise = fetch(this.getInputFromSingleOwner("url"), {
				"method": this.getInputFromSingleOwner("method"),
				"body": bodyData,
				"credentials": "include",
				"headers": this.getInputFromSingleOwner("headers")
			})
			.then(this._promise_loadResponseBound)
			.then(this._promise_dataEncoded)
			.catch(this._promise_loadingErrorBound);
		}
	}
	
	_promise_loadResponse(aResponse) {
		console.log("wprr/manipulation/adjustfunctions/control/loader/TriggerUrlRequest::_promise_loadResponse");
		
		this._responseOk = aResponse.ok;
		
		return aResponse.text();
	}
	
	_promise_dataEncoded(aDataString) {
		console.log("wprr/manipulation/adjustfunctions/control/loader/TriggerUrlRequest::_promise_dataEncoded");
		//METODO
		console.log(aDataString);
	}
	
	_promise_loadingError(aError) {
		console.log("wprr/manipulation/adjustfunctions/control/loader/TriggerUrlRequest::_promise_loadingError");
		console.error(aError);
		//METODO
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
