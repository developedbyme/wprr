//import ArrayFunctions from "wprr/utils/ArrayFunctions";
export default class ArrayFunctions {
	
	static arrayOrSeparatedString(aData, aSeparator = ",", aTrim = 3) {
		if(aData === null || aData === undefined) {
			return [];
		}
		else if(aData instanceof Array) {
			return aData;
		}
		else if(typeof(aData) === "string") {
			return aData.split(aSeparator); //METODO: trim
		}
		
		console.error(aData + " is not array or string.");
		return [];
	}
}