import React from "react";
import Wprr from "wprr/Wprr";
import moment from "moment";

export default class Actions extends Wprr.BaseObject {
	
	_construct() {
		super._construct();
		
		this._elementTreeItem.setValue("date", this.getFirstInputWithDefault(Wprr.sourceQueryString("date"), moment().format("Y-MM-DD")))
		
		let loader = this._elementTreeItem.createNode("actionsLoader", "loadDataRange");
		this._elementTreeItem.getLinks("items").input(loader.item.getLinks("items"));
		
		let mappedList = this._elementTreeItem.addNode("mappedList", new Wprr.utils.data.multitypeitems.controllers.list.ActiveList());
		mappedList.item.setValue("activteWhenAdded", false);
		mappedList.setupCommands.addCommands.push(Wprr.commands.callFunction(this, this._setupSelectItem, [Wprr.sourceEvent()]));
		mappedList.item.getLinks("items").input(this._elementTreeItem.getLinks("items"));
		
		this._elementTreeItem.getLinks("rows").input(mappedList.item.getLinks("rows"));
		
		loader.setUrl(this.getWprrUrl("range/?select=relation,includePrivate,inDateRange&encode=action&type=action&startDate=" + this._elementTreeItem.getValue("date") + "&endDate=" + this._elementTreeItem.getValue("date"), "wprrData"));
	}
	
	_setupSelectItem(aId) {
		let item = this._elementTreeItem.group.getItem(aId);
		let action = Wprr.objectPath(item, "forItem.linkedItem");
		
		console.log("action>>>>>", action);
		
		let relations = Wprr.utils.array.getItemsBy("type.id", "dbm_type:object-relation/for", Wprr.objectPath(action, "incomingRelations.items"));
		relations = Wprr.utils.array.getItemsBy("from.linkedItem.objectTypes.ids", "dbm_type:type/action-status", relations, "arrayContains");
		
		let currentTime = moment().unix();
		
		let currentArray = relations;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentRelation = currentArray[i];
			console.log(currentRelation);
			
			let startAt = currentRelation.getValue("startAt");
			let endAt = currentRelation.getValue("endAt");
			
			if((startAt === -1 || startAt <= currentTime) && (endAt === -1 || endAt > currentTime)) {
				action.addSingleLink("currentStatus", Wprr.objectPath(currentRelation, "from.id"));
				action.setValue("currentStatusTime", startAt);
				break;
			}
		}
	}
	
	_renderMainElement() {
		
		return <div>
			<Wprr.layout.ItemList ids={this._elementTreeItem.getLinks("rows").idsSource} as="row" className="standard-alternating-rows">
				<Wprr.RelatedItem id="forItem.linkedItem" from={Wprr.sourceReference("row")} as="item">
					<div className="standard-row standard-row-padding" itemClasses="flex-no-resize,flex-no-resize,flex-no-resize,flex-no-resize,flex-resize">
						<Wprr.FlexRow className="small-item-spacing">
							<div className="table-cell-width-select">
								<Wprr.Checkbox checked={Wprr.sourceReference("row", "active")} />
							</div>
							<div className="table-cell-width-short">
								<Wprr.Link href={Wprr.sourceCombine(Wprr.sourceReference("projectLinks", "wp/site/admin/items/item/"), "?id=", Wprr.sourceReference("item", "id"))}>
									{Wprr.text(Wprr.sourceReference("item", "id"))}
								</Wprr.Link>
							</div>
							<div className="table-cell-width-text-flag">
								<Wprr.HasData check={Wprr.sourceReference("item", "currentStatus.linkedItem.identifier.value")}>
									<Wprr.SelectSection selectedSections={Wprr.sourceReference("item", "currentStatus.linkedItem.identifier.value")}>
										<div data-section-name="done" className="standard-flag standard-flag-padding text-align-center button-status-green">
											{Wprr.text(Wprr.sourceReference("item", "currentStatus.linkedItem.name"))}
										</div>
										<div data-section-name="noAction" className="standard-flag standard-flag-padding text-align-center button-status-red">
											{Wprr.text(Wprr.sourceReference("item", "currentStatus.linkedItem.name"))}
										</div>
										<div data-default-section={true} className="standard-flag standard-flag-padding text-align-center">
											{Wprr.text(Wprr.sourceReference("item", "currentStatus.linkedItem.name"))}
										</div>
									</Wprr.SelectSection>
									<div className="spacing small" />
									<div className="small-description text-align-center">
										<Wprr.DateDisplay date={Wprr.sourceReference("item", "currentStatusTime")} format="Y-MM-DD HH:mm:ss" inputType="unix" />
									</div>
								</Wprr.HasData>
							</div>
							<div className="table-cell-width-extra-long">
								<div className="break-words">{Wprr.text(Wprr.sourceReference("item", "type.linkedItem.name"))}</div>
								<Wprr.HasData check={Wprr.sourceReference("item", "data")}>
									<div className="spacing small" />
									<pre className="no-margins small-description break-words">{Wprr.text(Wprr.sourceFunction(JSON, JSON.stringify, [Wprr.sourceReference("item", "data.value")]))}</pre>
								</Wprr.HasData>
							</div>
							<div>
								<Wprr.layout.ItemList ids={Wprr.sourceReference("item", "from.idsSource")} as="fromItem">
									<div className="break-words">
										<Wprr.Link href={Wprr.sourceCombine(Wprr.sourceReference("projectLinks", "wp/site/admin/items/item/"), "?id=", Wprr.sourceReference("fromItem", "id"))}>
											{Wprr.text(Wprr.sourceReference("fromItem", "id"))}
											{" - "}
											{Wprr.text(Wprr.sourceReference("fromItem", "title"))}
										</Wprr.Link>
									</div>
									<div data-slot="spacing" className="spacing small" />
								</Wprr.layout.ItemList>
							</div>
						</Wprr.FlexRow>
					</div>
				</Wprr.RelatedItem>
			</Wprr.layout.ItemList>
		</div>;
	}
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		
	}
}
