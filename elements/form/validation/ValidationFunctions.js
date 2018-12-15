// import ValidationFunctions from "wprr/elements/form/validation/ValidationFunctions";
export default class ValidationFunctions {

	static noValidation(aCheckValue, aAdditionalData) {
		return true;
	}
	
	static checkboxClicked(aCheckValue, aAdditionalData) {
		return aCheckValue;
	}
	
	static positiveValue(aCheckValue, aAdditionalData) {
		//console.log("wprr/elements/form/validation/ValidationFunctions::positiveValue");
		
		let checkNumber = parseFloat(aCheckValue);
		
		return (!isNaN(checkNumber) && checkNumber > 0);
	}
	
	static notEmpty(aCheckValue, aAdditionalData) {
		//console.log("wprr/elements/form/validation/ValidationFunctions::notEmpty");
		
		let checkString = aCheckValue + "";
		
		return (checkString && checkString.length > 0);
	}
	
	static isEmail(aCheckValue, aAdditionalData) {
		
		let re = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
		return re.test(aCheckValue.toLowerCase());
	}
	
	static internationalPhoneNumber(aCheckValue, aAdditionalData) {
		let re = /^\+[1-9]{1,3} ?[0-9]{3,15}$/;
		return re.test(aCheckValue.toLowerCase());
	}
	
	static matchField(aCheckValue, aAdditionalData) {
		console.log("wprr/elements/form/validation/ValidationFunctions::matchField");
		
		let secondField = aAdditionalData.data["field"];
		let secondValue = secondField.getValue();
		
		return (aCheckValue === secondValue);
	}
}
