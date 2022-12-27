import Wprr from "wprr/Wprr";

import BaseObject from "wprr/core/BaseObject";

// import Pagination from "./Pagination";
export default class Pagination extends BaseObject {
	
	constructor() {
		super();
		
		this._updateCommand = Wprr.commands.callFunction(this, this._update);
		this._makeSureCurrentPageIsInBoundsCommand = Wprr.commands.callFunction(this, this._makeSureCurrentPageIsInBounds);
		
		this.createSource("totalSize", 0).addChangeCommand(this._updateCommand);
		this.createSource("pageSize", 10).addChangeCommand(this._updateCommand);
		this.createSource("currentPage", 0).addChangeCommand(this._updateCommand);
		this.createSource("startIndex", 0).addChangeCommand(this._updateCommand);
		
		this.createSource("numberOfPages", 0).addChangeCommand(this._makeSureCurrentPageIsInBoundsCommand)
		this.createSource("startAt", 0);
		this.createSource("endAt", 0);
	}
	
	_makeSureCurrentPageIsInBounds() {
		//console.log("_makeSureCurrentPageIsInBounds");
		
		let startIndex = this.startIndex;
		let currentPage = this.currentPage-startIndex;
		if(this.numberOfPages === 0) {
			this.currentPage = startIndex;
		}
		if(currentPage >= this.numberOfPages) {
			this.currentPage = this.numberOfPages-1+startIndex;
		}
	}
	
	_update() {
		//console.log("_update");
		
		let totalSize = this.totalSize;
		let pageSize = this.pageSize;
		let startIndex = this.startIndex;
		
		let numberOfPages = (this.pageSize > 0) ? Math.ceil(this.totalSize/this.pageSize) : 0;
		this.numberOfPages = numberOfPages;
		
		let currentPage = this.currentPage-startIndex;
		let startAt = Math.min(this.totalSize, pageSize*currentPage);
		this.startAt = startAt;
		this.endAt = Math.min(this.totalSize, this.startAt+pageSize);
	}
	
	connectArrayToSize(aArray) {
		let getPropertyNode = Wprr.utils.data.nodes.GetProperty.connect(aArray, "length");
		this.sources.get("totalSize").input(getPropertyNode.sources.get("value"));
		
		return getPropertyNode;
	}
	
	static connect(aTotalSize = null, aPageSize = null, aCurrentPage = null) {
		//console.log("Pagination::connect");
		
		let newPagination = new Pagination();
		
		if(aTotalSize) {
			newPagination.sources.get("totalSize").input(aTotalSize);
		}
		if(aPageSize) {
			newPagination.sources.get("pageSize").input(aPageSize);
		}
		if(aCurrentPage) {
			newPagination.sources.get("currentPage").input(aCurrentPage);
		}
		
		return newPagination;
	}
}