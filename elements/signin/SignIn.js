import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

export default class SignIn extends Layout {
	
	_construct() {
		super._construct();
		
		this._elementTreeItem.requireValue("uiState", null);
		this._elementTreeItem.requireValue("submitElement", null);
		this._elementTreeItem.requireValue("showErrorMessage", false);
		
		let form = this._elementTreeItem.addNode("form", new Wprr.utils.data.multitypeitems.controllers.form.Form());
		
		form.createField("email", "").getType("controller").addNotEmptyValidation();
		form.createField("password", "").getType("controller").addNotEmptyValidation();
		
		let validSwitch = this._elementTreeItem.addNode("validSwitch", new Wprr.utils.data.nodes.logic.Switch());
		validSwitch.sources.get("input").input(form.item.getValueSource("isValid"));
		validSwitch.defaultValue = "incomplete";
		validSwitch.addCase(true, "complete");
		
		let stateSwitch = this._elementTreeItem.addNode("stateSwitch", new Wprr.utils.data.nodes.logic.First());
		stateSwitch.addValues(this._elementTreeItem.getValueSource("uiState"), validSwitch.sources.get("output"));
		
		let submitElementSwitch = this._elementTreeItem.addNode("submitElementSwitch", new Wprr.utils.data.nodes.logic.Switch());
		submitElementSwitch.sources.get("input").input(stateSwitch.sources.get("output"));
		submitElementSwitch.defaultValue = React.createElement(Wprr.layout.interaction.Button, {"className": "standard-button standard-button-padding inactive", "text": Wprr.sourceTranslation("Sign in", "site.signInForm.signIn"), commands: Wprr.commands.callFunction(Wprr.sourceReference("form", "controller"), "validate")});
		submitElementSwitch.addCase("complete", React.createElement(Wprr.layout.interaction.Button, {"text": Wprr.sourceTranslation("Sign in", "site.signInForm.signIn"), "commands": Wprr.commands.callFunction(this, this._signIn)}));
		submitElementSwitch.addCase("processing", React.createElement("div", {"className": "standard-button standard-button-padding inactive-during-progress"},
			React.createElement(Wprr.FlexRow, {className: "justify-center micro-item-spacing vertically-center-items"},
				React.createElement(Wprr.Image, {"src": Wprr.sourceReference("projectLinks", "wp/images/(button-content)/loader.svg"), "className": "background-contain loader-spinner"}),
				Wprr.idText("Signing in...", "site.signInForm.signingIn")
			)
		));
		submitElementSwitch.addCase("done", React.createElement("div", {"className": "standard-button standard-button-padding not-interactive"},
			Wprr.idText("Signed in", "site.signInForm.signedIn")
		));
		
		this._elementTreeItem.getValueSource("submitElement").input(submitElementSwitch.sources.get("output"));
	}
	
	_signIn() {
		this._elementTreeItem.setValue("uiState", "processing");
		this._elementTreeItem.setValue("showErrorMessage", false);
		
		let project = this._elementTreeItem.group.getItem("project").getType("controller");
		
		let fields = Wprr.objectPath(this._elementTreeItem, "form.linkedItem.controller").getValues();
		
		let email = fields["email"];
		let password = fields["password"];
		let remember = false;
		
		let loader = project.getLoginLoader(email, password, remember);
		
		loader.addErrorCommand(Wprr.commands.callFunction(this, this._showErrorMessage, []));
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this._checkLogIn, [Wprr.sourceEvent("data")]));
		
		loader.load();
	}
	
	_checkLogIn(aData) {
		//console.log("_checkLogIn");
		//console.log(aData);
		
		if(aData.authenticated) {
			this._elementTreeItem.setValue("uiState", "done");
			
			let url = this.getFirstInput(Wprr.sourceQueryString("redirectTo"), Wprr.sourceQueryString("redirect_to"), Wprr.sourceReference("projectLinks", "wp/home/my-account/"));
			wprr.navigate(url);
		}
		else {
			this._showErrorMessage();
		}
	}
	
	_showErrorMessage() {
		this._elementTreeItem.setValue("uiState", null);
		this._elementTreeItem.setValue("showErrorMessage", true);
	}
	
	_getLayout(aSlots) {
		
		return React.createElement("div", {className: "centered-content-text"},
			React.createElement(Wprr.AddReference, {"data": this._elementTreeItem.getType("form").linkedItem, "as": "form"},
				React.createElement(Wprr.layout.form.LabelledArea, {"label": Wprr.sourceTranslation("Email", "site.signInForm.email")},
					React.createElement(Wprr.AddReference, {data: Wprr.sourceReference("form", "fields.email"), as: "field"},
						React.createElement(Wprr.AddProps, {className: Wprr.sourceReference("field", "validationStatus")},
							React.createElement(Wprr.FormField, {"value": Wprr.sourceReference("field", "value"), isEditing: Wprr.sourceReference("field", "isEditing"), "className": "standard-field standard-field-padding full-width"})
						)
					)
				),
				React.createElement("div", {className: "spacing standard"}),
				React.createElement(Wprr.layout.form.LabelledArea, {"label": Wprr.sourceTranslation("Password", "site.signInForm.password")},
					React.createElement(Wprr.AddReference, {data: Wprr.sourceReference("form", "fields.password"), as: "field"},
						React.createElement(Wprr.AddProps, {className: Wprr.sourceReference("field", "validationStatus")},
							React.createElement(Wprr.FormField, {"value": Wprr.sourceReference("field", "value"), isEditing: Wprr.sourceReference("field", "isEditing"), "type": "password", "className": "standard-field standard-field-padding full-width"})
						)
					)
				),
				React.createElement("div", {className: "spacing standard"}),
				React.createElement(Wprr.FlexRow, {"className": "justify-between vertically-center-items"},
					React.createElement("div", {},
						React.createElement(Wprr.Link, {"href": Wprr.sourceReference("projectLinks", "wp/home/sign-in/lost-password/")},
							Wprr.idText("Lost password", "site.signInForm.lostPassword")
						)
					),
					React.createElement("div", {},
						React.createElement(Wprr.InsertElement, {"element": this._elementTreeItem.getValueSource("submitElement")})
					)
				)
			)
		);
	}
	
	static getWpAdminEditor() {
		//console.log("getWpAdminEditor");
		
		let dataSettings = {
			
		};
		
		return React.createElement(Wprr.layout.admin.WpBlockEditor, {dataSettings: dataSettings},
			React.createElement("div", null)
		);
	}
}
