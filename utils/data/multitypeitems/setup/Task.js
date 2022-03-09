import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Task from "./Task";
export default class Task extends BaseObject {
	
	constructor() {
		super();
	}
	
	static prepare(aItem) {
		console.log("Task::prepare");
		
		aItem.requireValue("hasData/task", false);
		aItem.requireSingleLink("type");
		aItem.requireSingleLink("status");
		
		return this;
	}
	
	static setup(aItem, aData) {
		
		aItem.addSingleLink("status", aData["status"]);
		aItem.addSingleLink("type", aData["type"]);
		aItem.setValue("hasData/task", true);
		
		return this;
	}
}