import React from "react";
import Wprr from "wprr/Wprr";
import moment from "moment";

export default class CreateAction extends Wprr.BaseObject {
	
	_construct() {
		super._construct();
		
		this._action = Wprr.sourceValue("");
		this._from = Wprr.sourceValue("");
		this._data = Wprr.sourceValue({});
	}
	
	_runAction() {
		let project = this.getFirstInput(Wprr.sourceReference("wprr/project"));
		
		let from = this._from.value.split(",");
		from = Wprr.utils.array.removeValues(Wprr.utils.array.castToFloat(Wprr.utils.array.trimArray(from)), [0]);
		
		let loader = project.getPerformActionLoader(this._action.value, from, this._data.value);
		
		loader.load();
	}
	
	_renderMainElement() {
		
		return <div className="centered-site">
			<Wprr.layout.form.LabelledArea label="Action">
				<Wprr.FormField value={this._action} className="standard-field standard-field-padding full-width" />
			</Wprr.layout.form.LabelledArea>
			<div className="spacing medium" />
			<Wprr.layout.form.LabelledArea label="From">
				<Wprr.FormField value={this._from} className="standard-field standard-field-padding full-width" />
			</Wprr.layout.form.LabelledArea>
			<div className="spacing medium" />
			<Wprr.layout.form.LabelledArea label="Data">
				<div className="standard-field standard-field-padding">
					<Wprr.JsonEditor value={this._data} />
				</div>
			</Wprr.layout.form.LabelledArea>
			<div className="spacing medium" />
			<Wprr.FlexRow>
				<Wprr.layout.interaction.Button text="Create and perform" commands={Wprr.commands.callFunction(this, this._runAction)} />
			</Wprr.FlexRow>
		</div>;
	}
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		
	}
}
