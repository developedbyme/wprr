import Wprr from "wprr/Wprr";

import ProcessPart from "wprr/utils/process/ProcessPart";

// import LoadingProcess from "wprr/utils/process/parts/LoadingProcess";
export default class LoadingProcess extends ProcessPart {
	
	constructor() {
		super();
		
		this._loader = null;
		
		this.setInput("loaderClass", Wprr.utils.JsonLoader);
		
		this.setInput("url", null);
		this.setInput("body", {});
		
		this.setInput("successStep", "success");
		this.setInput("errorStep", "error");
	}
	
	setSteps(aSuccessStep = null, aErrorStep = null) {
		this.setInputWithoutNull("successStep", aSuccessStep);
		this.setInputWithoutNull("errorStep", aErrorStep);
		
		return this;
	}
	
	storeLoadedData(aDataHolder, aName, aDataPath = null) {
		
		let dataPath = "data";
		if(aDataPath) {
			dataPath += "." + aDataPath;
		}
		
		this.addCommand("loaded", Wprr.commands.setValue(aDataHolder, aName, Wprr.source("event", "raw", dataPath)));
		
		return this;
	}
	
	storeErrorData(aDataHolder, aName, aDataPath = "data.message") {
		let dataPath = "data";
		if(aDataPath) {
			dataPath += "." + aDataPath;
		}
		
		this.addCommand("errorLoading", Wprr.commands.setValue(aDataHolder, aName, Wprr.source("event", "raw", dataPath)));
		
		return this;
	}
	
	_dataLoaded(aData) {
		this._runCommandGroup("loaded", aData);
		this._nextStepName = this.getInput("successStep");
		this.done();
		
		return this;
	}
	
	_loadingError(aData) {
		this._runCommandGroup("errorLoading", aData);
		this._nextStepName = this.getInput("errorStep");
		this.done();
		
		return this;
	}
	
	createLoader() {
		
		let LoaderClass = this.getInput("loaderClass");
		
		return new LoaderClass();
	}
	
	setupLoader(aLoader) {
		
		aLoader.setupJsonPost(this.getInput("url"), this.getInput("body"));
		let userData = this._element.getReference("wprr/userData");
		if(userData) {
			let nonce = userData.restNonce;
			aLoader.addHeader("X-WP-Nonce", nonce);
		}
		
		return this;
	}
	
	start() {
		//console.log("wprr/utils/process/parts/LoadingProcess::start");
		
		super.start();
		
		this._loader = this.createLoader();
		
		this._loader.addSuccessCommand(Wprr.commands.callFunction(this, this._dataLoaded, [Wprr.source("event", "raw")]));
		this._loader.addErrorCommand(Wprr.commands.callFunction(this, this._loadingError, [Wprr.source("event", "raw")]));
		
		this.setupLoader(this._loader);
		this._loader.load();
		
		return this;
	}
	
	continue() {
		//console.log("wprr/utils/process/parts/LoadingProcess::continue");
		
		console.warn("Continue can't be called on a loading process");
	}
	
	static create(aUrl, aBody = null, aSuccessStep = null, aErrorStep = null) {
		let newLoadingProcess = new LoadingProcess();
		
		newLoadingProcess.setInputWithoutNull("url", aUrl);
		newLoadingProcess.setInputWithoutNull("body", aBody);
		newLoadingProcess.setSteps(aSuccessStep, aErrorStep);
		
		return newLoadingProcess;
	}
}