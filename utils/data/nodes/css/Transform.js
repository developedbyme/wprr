import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Transform from "./Transform";
export default class Transform extends BaseObject {
	
	constructor() {
		super();
		
		this.createSource("operation", "notSet");
		
		this.values = new Wprr.utils.data.nodes.JoinValues();
		this.values.separator = ", ";
		
		this.textReplacement = new Wprr.utils.data.nodes.ReplaceText();
		this.textReplacement.text = "operation(values)";
		
		this.textReplacement.addReplacement("operation", "");
		this.textReplacement.sources.get("operation").connectSource(this.sources.get("operation"));
		
		this.textReplacement.addReplacement("values", "");
		this.textReplacement.sources.get("values").connectSource(this.values.sources.get("output"));
		
		this.createSource("transform", "").connectSource(this.textReplacement.sources.get("replacedText"));
		
	}
	
	setupUniformScale() {
		let scale = this.createSource("scale", 1);
		this.operation = "scale";
		
		this.values.addNamedValue("x", 1);
		this.values.addNamedValue("y", 1);
		
		scale.connectSource(this.values.sources.get("x"));
		scale.connectSource(this.values.sources.get("y"));
		
		return this;
	}
	
	setupScale() {
		let x = this.createSource("x", 1);
		let y = this.createSource("y", 1);
		
		this.operation = "scale";
		
		this.values.addNamedValue("x", 1);
		this.values.addNamedValue("y", 1);
		
		x.connectSource(this.values.sources.get("x"));
		y.connectSource(this.values.sources.get("y"));
		
		return this;
	}
	
	setupRotation() {
		let amount = this.createSource("amount", 0);
		let unit = this.createSource("unit", "deg");
		
		let amountAndUnit = new Wprr.utils.data.nodes.JoinValues();
		amountAndUnit.separator = "";
		this.createSource("amountAndUnitNode", amountAndUnit);
		
		amountAndUnit.addNamedValue("amount", 0);
		amountAndUnit.addNamedValue("unit", "deg");
		
		amount.connectSource(amountAndUnit.sources.get("amount"));
		unit.connectSource(amountAndUnit.sources.get("unit"));
		
		this.operation = "rotate";
		
		this.values.addNamedValue("rotation", "0deg");
		
		amountAndUnit.sources.get("output").connectSource(this.values.sources.get("rotation"));
		
		return this;
	}
}