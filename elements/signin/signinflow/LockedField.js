import React from "react";
import Wprr from "wprr";

export default class LockedField extends Wprr.Layout {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_getLayout(aSlots) {
		
		return <Wprr.layout.form.LabelledArea label={aSlots.prop("label", Wprr.sourceTranslation("Email"))}>
			<div className="standard-field standard-field-padding uneditable">
				<Wprr.FlexRow className="small-item-spacing justify-between">
					{aSlots.default(Wprr.text(Wprr.sourceReference("externalStorage", aSlots.prop("fieldName", "email"))))}
					<Wprr.CommandButton commands={Wprr.commands.callFunction(Wprr.sourceReference("steppedPaths"), "changeStep", [aSlots.prop("step", "changeEmail")])}>
						<div className="action-link secondary cursor-pointer">{Wprr.translateText("Change")}</div>
					</Wprr.CommandButton>
				</Wprr.FlexRow>
			</div>
		</Wprr.layout.form.LabelledArea>;
	}
}
