import Wprr from "wprr/Wprr";
import objectPath from "object-path";

import ProcessPart from "wprr/utils/process/ProcessPart";

// import SelectNextStep from "wprr/utils/process/parts/SelectNextStep";
export default class SelectNextStep extends ProcessPart {
	
	constructor() {
		super();
		
		this.setInput("value", null);
		this.setInput("stepValues", new Array());
	}
	
	addStepValue(aValue, aStepName) {
		let stepValues = this.inputs.getRawInput("stepValues");
		
		stepValues.push({"key": aValue, "value": aStepName});
		
		return this;
	}
	
	start() {
		//console.log("wprr/utils/process/parts/SelectNextStep::start");
		
		super.start();
		
		let value = this.getInput("value");
		let stepValues = this.getInput("stepValues");
		
		let selectedValue = Wprr.utils.array.getItemBy("key", value, stepValues);
		
		this._nextStepName = objectPath.get(selectedValue, "value");
		this.done();
		
		return this;
	}
	
	completeDirectlyWhenStarted() {
		console.warn("Select steps always completes directly. No need manually set it.");
		return this;
	}
	
	static create(aValue, aStepValues = null) {
		let newSelectNextStep = new SelectNextStep();
		
		newSelectNextStep.setInputWithoutNull("value", aValue);
		newSelectNextStep.setInputWithoutNull("stepValues", aStepValues);
		
		return newSelectNextStep;
	}
}