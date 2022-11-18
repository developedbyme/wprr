import React from "react";
import Wprr from "wprr/Wprr";
import moment from "moment";

export default class Actions extends Wprr.BaseObject {
	
	_construct() {
		super._construct();
		
		let items = this._elementTreeItem.group;
		this._elementTreeItem.addSingleLink("operation", null);
		this._elementTreeItem.getLinks("selectedItems");
		
		this._elementTreeItem.setValue("date", this.getFirstInputWithDefault(Wprr.sourceQueryString("date"), moment().format("Y-MM-DD")))
		
		let loader = this._elementTreeItem.createNode("actionsLoader", "loadDataRange");
		this._elementTreeItem.getLinks("items").input(loader.item.getLinks("items"));
		
		let mappedList = this._elementTreeItem.addNode("mappedList", new Wprr.utils.data.multitypeitems.controllers.list.ActiveList());
		mappedList.item.setValue("activateWhenAdded", false);
		mappedList.setupCommands.addCommands.push(Wprr.commands.callFunction(this, this._setupSelectItem, [Wprr.sourceEvent()]));
		
		
		this._elementTreeItem.getLinks("rows").input(mappedList.item.getLinks("rows"));
		
		let detailsLoader = this._elementTreeItem.addNode("detailsLoader", new Wprr.utils.data.nodes.LoadAdditionalItems());
		detailsLoader.item.setValue("url", this.getWprrUrl("range/?select=idSelection,anyStatus&encode=action&ids={ids}", "wprrData"));
		
		mappedList.item.getLinks("items").input(detailsLoader.item.getLinks("loadedIds"));
		detailsLoader.item.getLinks("ids").input(loader.item.getLinks("items"));
		
		
		let batchEditItem = items.getItem("batchEdit/actions");
		
		{
			let noneItem = items.createInternalItem();
			noneItem.setValue("name", "None");
			noneItem.setValue("selectedLabel", "Select operation");
			batchEditItem.getLinks("batchActions").addItem(noneItem.id);
		}
		
		{
			let batchOpeartionItem = items.createInternalItem();
			batchOpeartionItem.setValue("name", "Api command");
			batchOpeartionItem.setValue("element", <Wprr.layout.admin.batch.ApiCommand />);
			batchEditItem.getLinks("batchActions").addItem(batchOpeartionItem.id);
		}
		
		
		loader.setUrl(this.getWprrUrl("range/?select=relation,includePrivate,inDateRange&encode=id&type=action&startDate=" + this._elementTreeItem.getValue("date") + "&endDate=" + this._elementTreeItem.getValue("date"), "wprrData"));
	}
	
	_setupSelectItem(aId) {
		let item = this._elementTreeItem.group.getItem(aId);
		let action = Wprr.objectPath(item, "forItem.linkedItem");
		
		let inArrayCondition = Wprr.utils.data.nodes.InArrayCondition.connect(this._elementTreeItem.getLinks("selectedItems").idsSource, item.getValueSource("active"), item.getType("forItem").id);
		item.addType("inArrayCondition", inArrayCondition);
		
		let relations = Wprr.utils.array.getItemsBy("type.id", "dbm_type:object-relation/for", Wprr.objectPath(action, "incomingRelations.items"));
		relations = Wprr.utils.array.getItemsBy("from.linkedItem.objectTypes.ids", "dbm_type:type/action-status", relations, "arrayContains");
		
		let currentTime = moment().unix();
		
		let currentArray = relations;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentRelation = currentArray[i];
			
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
			<Wprr.AddReference data={this._elementTreeItem} as="editorItem">
				<div>
					<Wprr.FlexRow className="small-item-spacing" itemClasses="flex-resize,flex-no-resize">
						<div>
							<div className="operations">
								<Wprr.SelectItem id="batchEdit/actions" as="batchEdit">
									<div>
										<Wprr.FlexRow className="micro-item-spacing">
											{Wprr.DropdownSelection.createSelfContained(
												React.createElement(Wprr.layout.form.DropdownButton, {
													"className": "cursor-pointer batch-operations-text batch-operations-select-title",
													"text": Wprr.sourceFirst(
														Wprr.sourceReference("editorItem", "operation.linkedItem.selectedLabel"),
														Wprr.sourceReference("editorItem", "operation.linkedItem.name"),
														Wprr.sourceTranslation("Select operation", "site.admin.selectOperation")
													),
													"sourceUpdates": Wprr.sourceReference("editorItem", "operation.idSource")
												}),
												<div className="custom-selection-container custom-selection-menu">
													<Wprr.layout.ItemList ids={Wprr.sourceReference("batchEdit", "batchActions.idsSource")}>
														<Wprr.CommandButton commands={[
															Wprr.commands.setProperty(Wprr.sourceReference("editorItem", "operation"), "id", Wprr.sourceReference("item", "id")),
															Wprr.commands.setValue(Wprr.sourceReference("value/open"), "open", false)
														]}>
															<div className="hover-row standard-row standard-row-padding cursor-pointer">{Wprr.text(Wprr.sourceReference("item", "name"))}</div>
														</Wprr.CommandButton>
													</Wprr.layout.ItemList>
												</div>,
												{ className: "absolute-container" }
											)}
											<Wprr.HasData check={Wprr.sourceReference("editorItem", "selectedItems.idsSource")} checkType="notEmpty">
												<Wprr.FlexRow className="micro-item-spacing batch-operations-text">
													<div>for</div>
													<Wprr.layout.ListWithOthers items={Wprr.sourceReference("editorItem", "selectedItems.items")} sourceUpdates={Wprr.sourceReference("editorItem", "selectedItems.idsSource")} showNumberOfItems={2} />
												</Wprr.FlexRow>
											</Wprr.HasData>
										</Wprr.FlexRow>
									</div>
								</Wprr.SelectItem>
							</div>
						</div>
					</Wprr.FlexRow>
					<Wprr.RelatedItem id="operation.linkedItem" from={Wprr.sourceReference("editorItem")} as="batchActionItem" sourceUpdates={Wprr.sourceReference("editorItem", "operation.idSource")}>
						<Wprr.InsertElement element={Wprr.sourceReference("batchActionItem", "element")} canBeEmpty={true} />
					</Wprr.RelatedItem>
				</div>
			</Wprr.AddReference>
		
			<Wprr.layout.ItemList ids={this._elementTreeItem.getLinks("rows").idsSource} as="row" className="standard-alternating-rows">
				<Wprr.RelatedItem id="forItem.linkedItem" from={Wprr.sourceReference("row")} as="item">
					<div className="standard-row standard-row-padding" itemClasses="flex-no-resize,flex-no-resize,flex-no-resize,flex-no-resize,flex-resize">
						<Wprr.FlexRow className="small-item-spacing flex-no-wrap">
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
