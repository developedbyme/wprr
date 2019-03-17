import ControlFunction from "wprr/manipulation/adjustfunctions/control/ControlFunction";

import TWEEN from "@tweenjs/tween.js";

//import SliderControl from "wprr/manipulation/adjustfunctions/control/slider/SliderControl";
export default class SliderControl extends ControlFunction {

	constructor() {
		super();
		
		this._name = "sliderControl";
		this._position = 0;
		this.numberOfItems = 0;
		this._intervalLength = -1;
		
		this._tween = null;
		this._intervalId = -1;
		
		this._animateToNextPositionBound = this._animateToNextPosition.bind(this);
	}
	
	_removePrefix(aString, aPrefix) {
		if(aString.indexOf(aPrefix) === 0) {
			return aString.substring(aPrefix.length, aString.length);
		}
		return null;
	}
	
	trigger(aName, aValue) {
		console.log("wprr/manipulation/adjustfunctions/control/slider/SliderControl::trigger");
		
		let triggerPrefix = this._name + "/";
		let actionName = this._removePrefix(aName, triggerPrefix);
		
		switch(actionName) {
			case "nextPosition":
				this._animateToNextPosition();
				break;
			case "previousPosition":
				this._animateToPreviousPosition();
				break;
			case "animateToClosestPosition":
				this.slideToClosestIndex(aValue);
				break;
			default:
				console.warn("No case for " + actionName + " (" + aName + ")",  this);
				break;
		}
	}
	
	updateValue(aName, aValue, aAdditionalData) {
		//METODO
	}
	
	injectReferences(aReturnObject) {
		
		let triggerPrefix = "trigger/" + this._name + "/";
		
		aReturnObject[triggerPrefix + "nextPosition"] = this;
		aReturnObject[triggerPrefix + "previousPosition"] = this;
		aReturnObject[triggerPrefix + "animateToClosestPosition"] = this;
		
		aReturnObject["value/" + this._name + "/position"] = this;
		aReturnObject["value/" + this._name + "/positionWithSlide"] = this;
		
		aReturnObject["control/" + this._name] = this;
	}
	
	setName(aName) {
		this._name = aName;
	}
	
	_getInitialState() {
		return {"position": this._position};
	}
	
	updatePosition(aPosition) {
		this._position = aPosition;
		
		let stateObject = {"position": this._position};
		
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
		//console.log("wprr/manipulation/adjustfunctions/control/slider/SliderControl::adjust");
		
		aData["position"] = this._position;
		
		return aData;
	}
	
	slideToClosestIndex(aIndex) {
		console.log("wprr/manipulation/adjustfunctions/control/slider/SliderControl::slideToClosestIndex");
		
		this._resetInterval();
		this._cancelAnimation();
		
		let position = this._position;
		let numberOfItems = this.numberOfItems;
		let times = Math.ceil(position/numberOfItems);
		
		if(isNaN(times)) {
			console.error("Closest position can't be retreived.", this);
			return;
		}
		
		
		let nextIndex = times*numberOfItems+aIndex;
		let previousIndex = (times-1)*numberOfItems+aIndex;
		
		if(Math.abs(nextIndex-position) === Math.abs(previousIndex-position)) {
			
			var localPosition = position-(Math.floor(position/numberOfItems)*numberOfItems);
			if(aIndex < localPosition) {
				this._animateToPosition(previousIndex, 0.8);
			}
			else {
				this._animateToPosition(nextIndex, 0.8);
			}
		}
		else if(Math.abs(nextIndex-position) < Math.abs(previousIndex-position)) {
			this._animateToPosition(nextIndex, 0.8);
		}
		else {
			this._animateToPosition(previousIndex, 0.8);
		}
	}
	
	setIntervalLength(aLength) {
		let isStarted = (this._intervalId !== -1);
		
		if(isStarted) {
			this.stopInterval();
		}
		
		this._intervalLength = aLength;
		
		if(isStarted) {
			this.startInterval();
		}
		
		return this;
	}
	
	stopInterval() {
		//console.log("wprr/manipulation/adjustfunctions/control/slider/SliderControl::stopInterval");
		
		if(this._intervalId !== -1) {
			clearInterval(this._intervalId);
			this._intervalId = -1;
		}
		
		return this;
	}
	
	startInterval() {
		//console.log("wprr/manipulation/adjustfunctions/control/slider/SliderControl::startInterval");
		
		if(this._intervalLength > 0 && this._intervalId === -1) {
			this._intervalId = setInterval(this._animateToNextPositionBound, this._intervalLength*1000)
		}
		
		return this;
	}
	
	_resetInterval() {
		let isStarted = (this._intervalId !== -1);
		
		if(isStarted) {
			this._stopInterval();
			this._startInterval();
		}
	}
	
	_cancelAnimation() {
		//METODO
	}
	
	_animateToPosition(aPosition, aTime) {
		let tweenParameters = {"position": this._position};
		let updateFunction = (function() {
			this.updatePosition(tweenParameters.position);
		}).bind(this);

		this._tween = new TWEEN.Tween(tweenParameters).to({"position": aPosition}, 1000*aTime).easing(TWEEN.Easing.Quadratic.Out).onUpdate(updateFunction).start();
	}
	
	_animateToNextPosition() {
		//console.log("wprr/manipulation/adjustfunctions/control/slider/SliderControl::_animateToNextPosition");
		
		var nextPosition = Math.floor(this._position+1);
		
		this._animateToPosition(nextPosition, 0.8);
	}
	
	_animateToPreviousPosition() {
		//console.log("wprr/manipulation/adjustfunctions/control/slider/SliderControl::_animateToPreviousPosition");
		
		var nextPosition = Math.floor(this._position-1);
		
		this._animateToPosition(nextPosition, 0.8);
	}
	
	static create(aNumberOfItems, aName = null, aIntervalLength = -1) {
		let newSliderControl = new SliderControl();
		
		if(aName !== null) {
			newSliderControl.setName(aName);
		}
		newSliderControl.numberOfItems = aNumberOfItems;
		newSliderControl.setIntervalLength(aIntervalLength);
		
		newSliderControl.startInterval();
		
		return newSliderControl;
	}
}

