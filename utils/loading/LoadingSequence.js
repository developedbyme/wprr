import Wprr from "wprr/Wprr";

import CommandPerformer from "wprr/commands/CommandPerformer";
import InputDataHolder from "wprr/utils/InputDataHolder";

// import LoadingSequence from "wprr/utils/loading/LoadingSequence";
/**
 * Loading sequence that loads multiple loader
 */
export default class LoadingSequence {
	
	/**
	 * Contructor
	 */
	constructor() {
		
		this._status = 0;
		this._hasError = false;
		this._checkLoadAfterAdding = false;
		
		this._loaders = new Array();
		this._waitingLoaders = new Array();
		this._loadingLoaders = new Array();
		this._loadedLoaders = new Array();
		
		this._numberOfConcurrentLoaders = LoadingSequence.DEFAULT_NUMBER_OF_CONCURRENT_LOADERS;
		this._continueOnError = LoadingSequence.DEFAULT_CONTINUE_ON_ERROR;
		
		this._commands = InputDataHolder.create();
	}
	
	addLoader(aLoader) {
		
		this._loaders.push(aLoader);
		this._waitingLoaders.push(aLoader);
		
		if(this._checkLoadAfterAdding) {
			if(this._status === 1 || this._status === 2) {
				this._checkForFurtherLoad();
			}
		}
		
		return this;
	}
	
	addCommand(aName, aCommand) {
		if(!this._commands.hasInput(aName)) {
			this._commands.setInput(aName, []);
		}
		
		//METODO: we just assumes that it is an array
		this._commands.getRawInput(aName).push(aCommand);
		
		return this;
	}
	
	addCommands(aName, aCommands) {
		if(!this._commands.hasInput(aName)) {
			this._commands.setInput(aName, []);
		}
		
		let commands = this._commands.getRawInput(aName);
		//METODO: we just assumes that it is an array
		commands = commands.concat(aCommands);
		this._commands.setInput(aName, commands);
		
		return this;
	}
	
	getProgress() {
		return this._loadedLoaders.length/this._loaders.length;
	}
	
	_loaderIsDone(aLoader) {
		//console.log("wprr/utils/loading/LoadingSequence::_loaderIsDone");
		
		let index = this._loadingLoaders.indexOf(aLoader);
		
		if(index >= 0) {
			this._loadingLoaders.splice(index, 1);
		}
		this._loadedLoaders.push(aLoader);
		
		{
			let commandName = "loaderDone";
			if(this._commands.hasInput(commandName)) {
				CommandPerformer.perform(this._commands.getInput(commandName, this.props, this), aLoader, this);
			}
		}
		
		{
			let commandName = "progress";
			if(this._commands.hasInput(commandName)) {
				CommandPerformer.perform(this._commands.getInput(commandName, this.props, this), this.getProgress(), this);
			}
		}
		
	}
	
	_performLoadMoreLoaders() {
		//console.log("wprr/utils/loading/LoadingSequence::_performLoadMoreLoaders");
		let currentArray = this._waitingLoaders;
		let currentArrayLength = currentArray.length;
		let numberOfLoadersToAdd = currentArrayLength;
		
		if(this._numberOfConcurrentLoaders > 0) {
			numberOfLoadersToAdd = Math.min(currentArrayLength, this._numberOfConcurrentLoaders-this._loadingLoaders.length);
		}
		
		let debugCounter = 0;
		while(numberOfLoadersToAdd > 0) {
			if(debugCounter++ > 100) {
				console.error("Loop ran for too long (" + debugCounter + ").");
				break;
			}
			
			let currentLoader = currentArray.shift();
			currentArrayLength--;
			
			let currentStatus = currentLoader.getStatus();
			if(currentStatus === 1 || currentStatus === -1) {
				this._loaderIsDone(currentLoader);
				numberOfLoadersToAdd = Math.min(numberOfLoadersToAdd, currentArrayLength);
			}
			else if(currentStatus === 0 || currentStatus === 2 || currentStatus === 3 || currentStatus === 4) {
				this._loadingLoaders.push(currentLoader);
				
				currentLoader.addSuccessCommand(Wprr.commands.callFunction(this, this._loaderIsDone, [currentLoader]));
				currentLoader.addSuccessCommand(Wprr.commands.callFunction(this, this._checkForFurtherLoad, []));
				
				currentLoader.addErrorCommand(Wprr.commands.callFunction(this, this._loaderIsDone, [currentLoader]));
				currentLoader.addErrorCommand(Wprr.commands.callFunction(this, this._setErrorInLoad, [currentLoader]));
				
				if(currentStatus === 0) {
					currentLoader.load();
				}
				if(numberOfLoadersToAdd > 0) {
					numberOfLoadersToAdd--;
				}
			}
			else {
				console.error("Unknown status " + currentStatus);
				numberOfLoadersToAdd--;
			}
		}
	}
	
	_calculateLoadingStatus() {
		if(this._waitingLoaders.length > 0 || this._loadingLoaders.length > 0) {
			return 2;
		}
		return 1;
	}
	
	_updateStatus(aNewStatus) {
		if(aNewStatus !== this._status) {
			this._status = aNewStatus;
			
			let commandName = "changeStatus";
			if(this._commands.hasInput(commandName)) {
				CommandPerformer.perform(this._commands.getInput(commandName, this.props, this), this._status, this);
			}
			
			if(this._status === 1) {
				let commandName = "loaded";
				if(this._commands.hasInput(commandName)) {
					CommandPerformer.perform(this._commands.getInput(commandName, this.props, this), [].concat(this._loaders), this);
				}
			}
		}
	}
	
	_checkForFurtherLoad() {
		//console.log("wprr/utils/loading/LoadingSequence::_checkForFurtherLoad");
		
		if(this._hasError && !this._continueOnError) {
			console.log("Loader sequence has stopped due to an error in a load.");
			this._updateStatus(-1);
			
			return;
		}
		
		this._checkLoadAfterAdding = false;
		
		{
			let commandName = "addMoreLoaders";
			if(this._commands.hasInput(commandName)) {
				CommandPerformer.perform(this._commands.getInput(commandName, this.props, this), this.getProgress(), this);
			}
		}
		
		this._performLoadMoreLoaders();
		
		this._checkLoadAfterAdding = true;
		this._updateStatus(this._calculateLoadingStatus());
		
	}
	
	_setErrorInLoad(aLoader) {
		console.error("Loader had an error", aLoader, this);
		this._hasError = true;
		this._checkForFurtherLoad();
	}
	
	load() {
		//console.log("wprr/utils/loading/LoadingSequence::load");
		
		let commandName = "start";
		if(this._commands.hasInput(commandName)) {
			CommandPerformer.perform(this._commands.getInput(commandName, this.props, this), null, this);
		}
		
		this._checkForFurtherLoad();
	}
	
	getAllData() {
		let returnArray = new Array();
		let currentArray = this._loaders;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentLoader = currentArray[i];
			returnArray.push(currentLoader.getData());
		}
		
		return returnArray;
	}
}

LoadingSequence.DEFAULT_NUMBER_OF_CONCURRENT_LOADERS = 5;
LoadingSequence.DEFAULT_CONTINUE_ON_ERROR = true;