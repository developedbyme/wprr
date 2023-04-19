import Wprr from "wprr/Wprr";

import MultiTypeItemConnection from "wprr/utils/data/MultiTypeItemConnection";

// import SaveOperation from "./SaveOperation";
export default class SaveOperation extends MultiTypeItemConnection {
	
	constructor() {
		super();
	}
	
	setup() {
		
		this._loaders = new Object();
		this._loadingSequence = new Wprr.utils.loading.LoadingSequence();
		
		return this;
	}
	
	get loadingSequence() {
		return this._loadingSequence;
	}
	
	setupForItem(aItem) {
		aItem.addType("saveOperation", this);
		this.setup();
		
		return this;
	}
	
	getEditLoader(aId) {
		let project = this.item.group.project;
		
		if(!this._loaders[aId]) {
			let loader = project.getEditLoader(aId);
			this._loadingSequence.addLoader(loader);
			this._loaders[aId] = loader;
		}
		
		return this._loaders[aId];
	}
	
	load() {
		this._loadingSequence.load();
	}
	
	static create(aItem) {
		let newSaveOperation = new SaveOperation();
		newSaveOperation.setupForItem(aItem);
		
		return newSaveOperation;
	}
}