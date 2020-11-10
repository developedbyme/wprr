import Wprr from "wprr/Wprr";

import ProjectRelatedItem from "wprr/utils/project/ProjectRelatedItem";

export default class Configuration extends ProjectRelatedItem {
	
	constructor() {
		super();
		
		this._prefix = null;
		this._doneCommands = null;
	}
	
	setPrefix(aPrefix) {
		this._prefix = aPrefix;
		
		return this;
	}
	
	setDoneCommands(aDoneCommands) {
		this._doneCommands = aDoneCommands;
		
		return this;
	}
	
	getRoutes() {
		
		let prefix = "";
		if(this._prefix && this._prefix.length > 0) {
			prefix = this._prefix + "/";
		}
		
		let routes = [
			{"test": "^" + prefix + "alreadySignedIn$", "type": "alreadySignedIn", "data": {"currentStep": 3, "numberOfSteps": 3}},
			{"test": "^" + prefix + "email$", "type": "email", "data": {"currentStep": 1, "numberOfSteps": 3}},
			{"test": "^" + prefix + "signIn$", "type": "signIn", "data": {"currentStep": 3, "numberOfSteps": 3}},
			{"test": "^" + prefix + "confirmPasswordVerification$", "type": "confirmPasswordVerification", "data": {"currentStep": 2, "numberOfSteps": 3}},
			{"test": "^" + prefix + "setPassword$", "type": "setPassword", "data": {"currentStep": 3, "numberOfSteps": 3}},
			{"test": "^" + prefix + "confirmEmail$", "type": "confirmEmail", "data": {"currentStep": 2, "numberOfSteps": 3}},
			{"test": "^" + prefix + "phoneNumber$", "type": "phoneNumber", "data": {"currentStep": 1, "numberOfSteps": 3}},
			{"test": "^" + prefix + "confirmPhoneNumber$", "type": "confirmPhoneNumber", "data": {"currentStep": 2, "numberOfSteps": 3}},
			{"test": "^" + prefix + "createAccount$", "type": "createAccount", "data": {"currentStep": 3, "numberOfSteps": 3}},
			{"test": "^" + prefix + "done$", "type": "done", "data": {"commands": this._doneCommands}}
		];
		
		return routes;
	}
	
	getDirections() {
		let directions = {
			"alreadySignedIn": {
				"next": "../done",
				"changeEmail": "../email"
			},
			"email": {
				"existing": "../signIn",
				"new": "../confirmEmail",
			},
			"signIn": {
				"next": "../done",
				"changeEmail": "../email",
				"resetPassword": "../confirmPasswordVerification"
			},
			"confirmPasswordVerification": {
				"next": "../setPassword",
				"changeEmail": "../email",
			},
			"setPassword": {
				"next": "../done",
				"changeEmail": "../email",
			},
			"confirmEmail": {
				"next": "../createAccount",
				"changeEmail": "../email"
			},
			"phoneNumber": {
				"next": "../confirmPhoneNumber",
				"changeEmail": "../email"
			},
			"confirmPhoneNumber": {
				"next": "../createAccount",
				"changeEmail": "../email",
				"changePhoneNumber": "../phoneNumber"
			},
			"createAccount": {
				"next": "../done",
				"changeEmail": "../email"
			}
		};
		
		return directions;
	}
	
	getStartScreen() {
		let startScreen = "email";
		if(this.project.getUserData()) {
			startScreen = "alreadySignedIn";
		}
		
		return startScreen;
	}
	
	static create(aPrefix = null) {
		let newConfiguration = new Configuration();
		newConfiguration.setPrefix(aPrefix);
		
		return newConfiguration;
	}
}