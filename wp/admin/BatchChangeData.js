import ChangeData from "wprr/wp/admin/ChangeData";

// import BatchChangeData from "wprr/wp/admin/BatchChangeData";
export default class BatchChangeData  {
	
	constructor() {
		this._items = new Array();
	}
	
	getBatchEditData() {
		let changesArray = new Array();
		
		let currentArray = this._items;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentItem = currentArray[i];
			
			let newBatchChange = currentItem.changeData.getEditData();
			newBatchChange["id"] = currentItem.id;
			changesArray.push(newBatchChange);
		}
		
		return {"batch": changesArray};
	}
	
	createItemChange(aId) {
		let newChangeData = new ChangeData();
		
		this._items.push({"id": aId, "changeData": newChangeData});
		
		return newChangeData;
	}
	
	createSharedItemsChange(aIds) {
		let newChangeData = new ChangeData();
		
		let currentArray = aIds;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			this._items.push({"id": currentArray[i], "changeData": newChangeData});
		}
		
		return newChangeData;
	}
}