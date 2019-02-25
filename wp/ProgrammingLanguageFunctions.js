import objectPath from "object-path";

// import ProgrammingLanguageFunctions from "wprr/wp/ProgrammingLanguageFunctions";
export default class ProgrammingLanguageFunctions {
	
	static convertToCamelCase(aText) {
		
		//METODO: remove special characters
		
		let specialCharactersRegExp = new RegExp("[^A-Za-z0-9 ]+", "g");
		
		//METODO: better replacement of all special characters
		aText = aText
			.replace(/å/g, "a")
			.replace(/ä/g, "a")
			.replace(/ö/g, "o")
			.replace(/Å/g, "A")
			.replace(/Ä/g, "A")
			.replace(/Ö/g, "O")
			.replace(specialCharactersRegExp, "");
		
		var currentArray = aText.split(" ");
		var currentArrayLength = currentArray.length;
		var returnText = currentArray[0].toLowerCase();
		for(var i = 1; i < currentArrayLength; i++) { //MENOTE: first iteration is done outside of loop
			var currentString = currentArray[i].toLowerCase();
			if(currentString.length > 0) {
				returnText += currentString[0].toUpperCase() + currentString.substring(1, currentString.length);
			}
		}
	
		return returnText;
	};
	
	static convertToWpSlug(aText) {
		
		//METODO: remove special characters
		
		let specialCharactersRegExp = new RegExp("[^A-Za-z0-9 ]+", "g");
		
		//METODO: better replacement of all special characters
		aText = aText
			.replace(/å/g, "a")
			.replace(/ä/g, "a")
			.replace(/ö/g, "o")
			.replace(/Å/g, "A")
			.replace(/Ä/g, "A")
			.replace(/Ö/g, "O")
			.replace(specialCharactersRegExp, "");
		
		var currentArray = aText.toLowerCase().split(" ");
		
		currentArray = currentArray.filter(function(aValue) {return aValue.length > 0});
		
		return currentArray.join("-");
	};
}