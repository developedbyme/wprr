import Wprr from "wprr/Wprr";

import UrlResolver from "wprr/utils/UrlResolver";
import objectPath from "object-path";

// import ProcessStepsSetup from "wprr/utils/navigation/ProcessStepsSetup";
export default class ProcessStepsSetup {
	
	constructor() {
		this._firstStep = null;
		this._routes = new Array();
		this._directions = new Array();
		this._stepNames = new Array();
		
		this._typeTemplates = new Object();
		
		this._lastStep = null;
	}
	
	get firstStep() {
		return this._firstStep;
	}
	
	get routes() {
		return this._routes;
	}
	
	get directions() {
		return this._directions;
	}
	
	setup(aSteps) {
		
		let currentArray = aSteps;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentStep = currentArray[i];
			
			let stepName = "step" + i;
			this._stepNames.push(stepName);
			let type = currentStep["type"];
			
			let addDirections = true;
			if(currentStep.statuses.indexOf("skipped") > -1 || currentStep.statuses.indexOf("completed") > -1) {
				addDirections = false;
			}
			else if(this._firstStep === null) {
				this._firstStep = stepName;
			}
			
			let template = this.getTemplateForType(stepName, type, currentStep);
			this._routes = this._routes.concat(template);
			
			if(addDirections) {
				if(this._lastStep !== null) {
					this._directions.push({"key": this._lastStep, "value": "/" + stepName});
				}
				this._lastStep = stepName;
			}
		}
		
		return this;
	}
	
	_addStepDataToTemplate(aStepName, aProcessPart, aReturnArray) {
		let currentArray = aReturnArray;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentItem = currentArray[i];
			currentItem.test = aStepName + currentItem.test;
			objectPath.set(currentItem, "data.processPart", aProcessPart);
			if(currentItem.children) {
				this._addStepDataToTemplate(aStepName, aProcessPart, currentItem.children);
			}
		}
	}
	
	getTemplateForType(aStepName, aType, aProcessPart) {
		if(this._typeTemplates[aType]) {
			let copiedObject = Wprr.utils.array.singleOrArray(Wprr.utils.object.copyViaJson(this._typeTemplates[aType]));
			this._addStepDataToTemplate(aStepName, aProcessPart, copiedObject);
			return copiedObject;
		}
		
		return {"test": aStepName, "type": aType, "data": {"processPart": aProcessPart}};
	}
	
	addTypeTemplate(aType, aData) {
		this._typeTemplates[aType] = aData;
		
		return this;
	}
}