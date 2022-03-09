"use strict";

import React from "react";
import Wprr from "wprr";

export default class EditProcess extends Wprr.BaseObject {
	
	constructor(aProps) {
		super(aProps);
		
		this._addMainElementClassName("field field-type-editLink auto-width-field");
	}

	_renderMainElement() {
		
		return <div>
			<Wprr.Link className="questions-edit-link" href={Wprr.sourceCombine(Wprr.sourceReference("projectLinks", "wp/site/admin/processes/process"), "?id=", Wprr.sourceReference("item", "id"))}>
				<Wprr.Image className="standard-icon background-contain" src="edit.svg" />
			</Wprr.Link>
		</div>;
	}
}
