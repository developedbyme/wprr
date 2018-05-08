//import StepFunctions from "wprr/elements/interaction/StepFunctions";
export default class StepFunctions  {

	static dateStep(aCurrentValue, aStep) {
		let currentMoment = moment(aCurrentValue);
		
		currentMoment.add(aStep, "d");
		
		return currentMoment.format('Y-MM-DD');
	}
	
	static dateStepMonth(aCurrentValue, aStep) {
		//console.log("wprr/elements/interaction/StepFunctions::dateStepMonth");
		//console.log(aCurrentValue);
		
		let currentMoment = moment(aCurrentValue);
		
		currentMoment.add(aStep, "M");
		
		return currentMoment.format('Y-MM');
	}
}
