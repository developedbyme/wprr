import OpacityApplyFunction from "wprr/manipulation/animation/applyfunctions/OpacityApplyFunction";
import TransformApplyFunction from "wprr/manipulation/animation/applyfunctions/TransformApplyFunction";

import ValueResolver from "wprr/manipulation/animation/inputresolvers/ValueResolver";

//import ApplyAnimation from "wprr/manipulation/animation/applyfunctions/ApplyAnimation";
export default class ApplyAnimation {
	
	static opacity(aValueName = "opacity", aK = 1, aM = 0) {
		return OpacityApplyFunction.create(ValueResolver.create(aValueName, aK, aM));
	}
	
	static transform(aOperation, aValues, aUnit = null) {
		return TransformApplyFunction.create(aOperation, aValues, aUnit);
	}
	
	static uniformScale(aValueName = "scale") {
		return ApplyAnimation.transform("scale", [aValueName, aValueName]);
	}
	
	static rotate(aValueName = "scale", aUnit = "deg") {
		return ApplyAnimation.transform("scale", [aValueName], aUnit);
	}
	
	static translate(aXValueName = "x", aYValueName = "y", aUnit = "px") {
		return ApplyAnimation.transform("translate", [aXValueName, aYValueName], aUnit);
	}
}
