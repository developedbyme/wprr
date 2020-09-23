import Wprr from "wprr";
import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class MultipleRelation extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		
		return React.createElement(Wprr.form.wp.multipletermsselection.MultipleTermsSelection, {
  valueName: "value",
  externalStorage: Wprr.sourceReference("field/externalStorage"),
  taxonomy: "dbm_relation",
  subtree: Wprr.sourceReference("field", "data.subtree")
});
	}
}