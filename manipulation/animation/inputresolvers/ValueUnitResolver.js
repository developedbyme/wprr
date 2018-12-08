import ValueResolver from "wprr/manipulation/animation/inputresolvers/ValueResolver";

//import ValueUnitResolver from "wprr/manipulation/animation/inputresolvers/ValueUnitResolver";
export default class ValueUnitResolver extends ValueResolver {

	constructor() {
		super();
		this.unit = "";
	}
	
	resolveValue(aValues, aElement) {
		//console.log("wprr/manipulation/animation/inputresolvers/ValueUnitResolver::resolveValue");
		//console.log(aValues, aElement);
		
		let value = super.resolveValue(aValues, aElement);
		
		return value + "" + this.unit;
	}
	
	static create(aValueName, aUnit, aK = 1, aM = 0) {
		let newValueUnitResolver = new ValueUnitResolver();
		
		newValueUnitResolver.valueName = aValueName;
		newValueUnitResolver.unit = aUnit;
		newValueUnitResolver.k = aK;
		newValueUnitResolver.m = aM;
		
		return newValueUnitResolver;
	}
}
