"use strict";

import React from "react";
import Wprr from "wprr";

//import * as questionStepAreas from "../dropdownareas/question-step-areas.js";

export default class ProcessPartStep extends Wprr.BaseObject {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_prepareInitialRender() {
		
		super._prepareInitialRender();
		
		let itemId = this.getFirstInput(Wprr.sourceReference("item", "id"));
		
		let itemsEditor = this.getFirstInput(Wprr.sourceReference("itemsEditor"));
		
		itemsEditor.enableEditsForItem(itemId);
	}
	
	componentWillUnmount() {
		
		super.componentWillUnmount();
		
		let itemId = this.getFirstInput(Wprr.sourceReference("item", "id"));
		
		let itemsEditor = this.getFirstInput(Wprr.sourceReference("itemsEditor"));
		
		itemsEditor.enableEditsForItem(itemId);
	}

	_renderMainElement() {
		
		return <div>
			<Wprr.FlexRow className="small-item-spacing flex-no-wrap">
				<Wprr.SelectField fieldName="name">
					<Wprr.layout.form.LabelledArea label={Wprr.sourceTranslation("Name", "site.fieldNames.name")}>
						<Wprr.layout.admin.im.Field />
					</Wprr.layout.form.LabelledArea>
				</Wprr.SelectField>
				<Wprr.SelectField fieldName="identifier">
					<Wprr.layout.form.LabelledArea label={Wprr.sourceTranslation("Identifier", "site.fieldNames.identifier")}>
						<Wprr.layout.admin.im.Field />
					</Wprr.layout.form.LabelledArea>
				</Wprr.SelectField>
				<Wprr.SelectField fieldName="description">
					<Wprr.layout.form.LabelledArea label={Wprr.sourceTranslation("Description", "site.fieldNames.description")}>
						<Wprr.layout.admin.im.Field />
					</Wprr.layout.form.LabelledArea>
				</Wprr.SelectField>
				<Wprr.SelectField fieldName="type">
					<Wprr.layout.form.LabelledArea label={Wprr.sourceTranslation("Type", "site.fieldNames.type")}>
						<Wprr.layout.admin.im.Field />
					</Wprr.layout.form.LabelledArea>
				</Wprr.SelectField>
				<Wprr.SelectField fieldName="value">
					<Wprr.layout.form.LabelledArea label={Wprr.sourceTranslation("Data", "site.fieldNames.data")}>
						<Wprr.layout.admin.im.Field />
					</Wprr.layout.form.LabelledArea>
				</Wprr.SelectField>
			</Wprr.FlexRow>
		</div>;
	}
}
