import objectPath from "object-path";
import Wprr from "wprr/Wprr";

//import ConditionEvaluation from "wprr/utils/logic/ConditionEvaluation";
export default class ConditionEvaluation {
	
	static evaluateCondition(aInputValue1, aConditionType, aInputValue2) {
		let returnValue = false;
		switch(aConditionType) {
			case "==":
				returnValue = (aInputValue1 == aInputValue2);
				break;
			case "===":
				returnValue = (aInputValue1 === aInputValue2);
				break;
			case ">=":
				returnValue = (aInputValue1 >= aInputValue2);
				break;
			case ">":
				returnValue = (aInputValue1 > aInputValue2);
				break;
			case "<=":
				returnValue = (aInputValue1 <= aInputValue2);
				break;
			case "<":
				returnValue = (aInputValue1 < aInputValue2);
				break;
			case "!=":
				returnValue = (aInputValue1 != aInputValue2);
				break;
			case "!=":
				returnValue = (aInputValue1 !== aInputValue2);
				break;
			case "&&":
				returnValue = (aInputValue1 && aInputValue2);
				break;
			case "||":
				returnValue = (aInputValue1 || aInputValue2);
				break;
			default:
				console.error("Unknown operation " + aConditionType, this);
				break;
		}
		
		return returnValue;
	}
}