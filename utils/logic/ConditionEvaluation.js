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
			case "inArray":
				return (aInputValue2.indexOf(aInputValue1) !== -1);
			case "notInArray":
				return (aInputValue2.indexOf(aInputValue1) === -1);
			case "arrayContains":
				return (aInputValue1.indexOf(aInputValue2) !== -1);
			case "arrayDoesNotContain":
				return (aInputValue1.indexOf(aInputValue2) === -1);
			case "caseInsensitiveEqual":
				return ((""+aInputValue1).toLowerCase() == (""+aInputValue2).toLowerCase());
			default:
				console.error("Unknown operation " + aConditionType, this);
				break;
		}
		
		return returnValue;
	}
}