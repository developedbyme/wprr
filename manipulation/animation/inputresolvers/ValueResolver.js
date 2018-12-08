import InputResolver from "wprr/manipulation/animation/inputresolvers/InputResolver";

//import ValueResolver from "wprr/manipulation/animation/inputresolvers/ValueResolver";
export default class ValueResolver extends InputResolver {

	constructor() {
		super();
		this.valueName = "input";
		this.k = 1;
		this.m = 0;
	}
	
	resolveValue(aValues, aElement) {
		//console.log("wprr/manipulation/animation/inputresolvers/ValueResolver::resolveValue");
		//console.log(aValues, aElement);
		
		return this.k*(aValues[this.valueName])+this.m;
	}
	
	static create(aValueName, aK = 1, aM = 0) {
		let newValueResolver = new ValueResolver();
		
		newValueResolver.valueName = aValueName;
		newValueResolver.k = aK;
		newValueResolver.m = aM;
		
		return newValueResolver;
	}
}
