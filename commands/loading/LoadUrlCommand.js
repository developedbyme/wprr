import SourceData from "wprr/reference/SourceData";

import BaseCommand from "wprr/commands/BaseCommand";
import JsonLoader from "wprr/utils/loading/JsonLoader";

import CallFunctionCommand from "wprr/commands/basic/CallFunctionCommand";

//import LoadUrlCommand from "wprr/commands/loading/LoadUrlCommand";
/**
 * Command that loads a url
 */
export default class LoadUrlCommand extends BaseCommand {
	
	/**
	 * Constructor
	 */
	constructor() {
		super();
		
		this.setInput("format", "json");
		this.setInput("url", null);
		this.setInput("method", "GET");
		this.setInput("headers", {});
		this.setInput("data", null);
		
		this.setInput("successCommands", []);
		this.setInput("errorCommands", []);
	}
	
	loaded(aData) {
		console.log("loaded");
		console.log(aData);
		
		let currentArray = this.getInput("successCommands");
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentCommand = currentArray[i];
			
			currentCommand.setTriggerElement(this._triggerElement);
			currentCommand.setEventData(aData);
			currentCommand.perform();
		}
	}
	
	perform() {
		
		let format = this.getInput("format");
		let url = this.getInput("url");
		let method = this.getInput("method");
		let headers = this.getInput("headers");
		let data = this.getInput("data");
		
		console.log(url);
		
		let loader;
		switch(format) {
			case "json":
				loader = new JsonLoader();
				break;
			default:
				console.error("Unknown format " + format,  this);
				return;
		}
		
		loader.setUrl(url);
		loader.setMethod(method);
		loader.setBody(data);
		
		for(let objectName in headers) {
			loader.addHeader(objectName, headers[objectName]);
		}
		
		let successCommand = CallFunctionCommand.create(this, this.loaded, [SourceData.create("event", null)]).setTriggerElement(this._triggerElement);
		
		loader.addSuccessCommand(successCommand);
		
		console.log(">>>>>>", loader);
		//METODO: add error commands
		loader.load();
	}
	
	static creatJsonGet(aUrl = null, aData = null, aHeaders = null) {
		let newLoadUrlCommand = new LoadUrlCommand();
		
		newLoadUrlCommand.setInput("format", "json");
		newLoadUrlCommand.setInput("method", "GET");
		
		newLoadUrlCommand.setInputWithoutNull("url", aUrl);
		newLoadUrlCommand.setInputWithoutNull("data", aData);
		newLoadUrlCommand.setInputWithoutNull("headers", aHeaders);
		
		return newLoadUrlCommand;
	}
	
	static createJsonPost(aUrl = null, aData = null, aHeaders = null) {
		let newLoadUrlCommand = new LoadUrlCommand();
		
		newLoadUrlCommand.setInput("format", "json");
		newLoadUrlCommand.setInput("method", "POST");
		
		newLoadUrlCommand.setInputWithoutNull("url", aUrl);
		newLoadUrlCommand.setInputWithoutNull("data", aData);
		newLoadUrlCommand.setInputWithoutNull("headers", aHeaders);
		
		return newLoadUrlCommand;
	}
}
