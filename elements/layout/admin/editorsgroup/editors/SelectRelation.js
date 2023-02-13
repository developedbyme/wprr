import React from "react";
import Wprr from "wprr/Wprr";
import moment from "moment";

import Layout from "wprr/elements/layout/Layout";

export default class SelectRelation extends Layout {
	
	_construct() {
		super._construct();
		
		this._elementTreeItem.setValue("mode", "view");
		this._elementTreeItem.setValue("search", "");
		
		let rangeLoader = this._elementTreeItem.addNode("rangeLoader", new Wprr.utils.data.nodes.LoadDataRange());
		
		let objectType = this.getFirstInputWithDefault("objectType", "type");
		
		this._elementTreeItem.getLinks("items").input(rangeLoader.item.getLinks("items"));
		
		let selectPath = this.getFirstInputWithDefault("selectPath", this.getWprrUrl("range/?select=anyStatus,relation&encode=" + this._getEncodings() + "&type=" + objectType, "wprrData"));
		
		rangeLoader.setUrl(selectPath);
		
		let filterItem = this._elementTreeItem.group.createInternalItem();
		let filteredList = Wprr.utils.data.multitypeitems.controllers.list.FilteredList.create(filterItem);
		filterItem.getType("all").input(this._elementTreeItem.getLinks("items"));
		
		let searchFilterItem = filteredList.addFieldSearch("title.value,id");
		this._elementTreeItem.addSingleLink("searchFilter", searchFilterItem.id);
		searchFilterItem.getType("searchValue").input(this._elementTreeItem.getValueSource("search"));
		
		let sortItem = this._elementTreeItem.group.createInternalItem();
		let sort = Wprr.utils.data.multitypeitems.controllers.list.SortedList.create(sortItem);
		this._elementTreeItem.addSingleLink("sort", sortItem.id);
		
		let searchResultField = this.getFirstInputWithDefault("searchResultField", "title");
		
		let newSortItem = sort.addFieldSort(searchResultField + ".value", function(aValue) {return aValue});
		newSortItem.addType("element", <div>By title</div>);
		newSortItem.setValue("buttonName", "title");
		
		sortItem.getLinks("all").input(filterItem.getLinks("filtered"));
		
		this._elementTreeItem.getLinks("sortedItems").input(sortItem.getType("sorted"));
	}
	
	_getEncodings() {
		return "postTitle,postStatus,objectTypes";
	}
	
	_createItem() {
		let itemEditor = this.getFirstInput("itemEditor", Wprr.sourceReference("itemEditor"));
		let itemId = itemEditor.editedItem.id;
		
		let creator = Wprr.utils.data.multitypeitems.controllers.admin.ItemCreator.create(this._elementTreeItem.group.createInternalItem());
		
		let search = this._elementTreeItem.getValue("search");
		creator.setTitle(search);
		
		let objectType = this.getFirstInputWithDefault("objectType", "type");
		creator.setDataType(objectType);
		
		let postStatus = this.getFirstInputWithDefault("newItemStatus", "draft");
		creator.changeData.setStatus(postStatus);
		
		creator.addCreatedCommand(Wprr.commands.setValue(Wprr.sourceEvent("createdItem.linkedItem"), "title", search));
		creator.addCreatedCommand(Wprr.commands.setValue(Wprr.sourceEvent("createdItem.linkedItem"), "postStatus", postStatus));
		
		let relationEditor = this.getRelationEditor().singleEditor;
		creator.addCreatedCommand(Wprr.commands.callFunction(relationEditor, relationEditor.setValue, [Wprr.sourceEvent("createdItem.id")]));
		
		creator.addCreatedCommand(Wprr.commands.callFunction(this._elementTreeItem.getLinks("creatingRows"), "removeItem", [creator.item.id]));
		this._elementTreeItem.getLinks("creatingRows").addItem(creator.item.id);
		
		creator.create();
	}
	
	getRelationEditor() {
		let itemEditor = this.getFirstInput("itemEditor", Wprr.sourceReference("itemEditor"));
		
		let direction = this.getFirstInputWithDefault("direction", "incoming");
		let relationType = this.getFirstInputWithDefault("relationType", "for");
		let objectType = this.getFirstInputWithDefault("objectType", "type");
		
		return itemEditor.getRelationEditor(direction, relationType, objectType);
	}
	
	_getLayout(aSlots) {
		//console.log("SelectRelations::_renderMainElement");
		
		let itemEditor = this.getFirstInput("itemEditor", Wprr.sourceReference("itemEditor"));
		let editorsGroup = itemEditor.editorsGroup;
		
		let direction = this.getFirstInputWithDefault("direction", "incoming");
		let relationType = this.getFirstInputWithDefault("relationType", "for");
		let objectType = this.getFirstInputWithDefault("objectType", "type");
		let relationName = (direction === "outgoing") ? "to.linkedItem" : "from.linkedItem";
		
		let allowCreation = this.getFirstInputWithDefault("allowCreation", true);
		
		let searchResultField = this.getFirstInputWithDefault("searchResultField", "title");
		
		return React.createElement("div", null,
			<Wprr.AddReference data={Wprr.sourceFunction(itemEditor, "getRelationEditor", [direction, relationType, objectType])} as="valueEditor">
				<Wprr.AddReference data={Wprr.sourceReference("valueEditor").deeper("singleEditor")} as="selectedEditor">
					<div>
						<Wprr.SelectSection selectedSections={this._elementTreeItem.getValueSource("mode")}>
							<div data-default-section={true}>
								
								<div className="standard-field standard-field-padding full-width">
									<Wprr.HasData check={Wprr.sourceReference("valueEditor", "item.activeRelations.idsSource")} checkType="notEmpty">
										<Wprr.layout.ItemList ids={Wprr.sourceReference("valueEditor", "item.activeRelations.idsSource")} as="relation">
											<Wprr.FlexRow className="small-item-spacing flex-no-wrap" itemClasses="flex-resize,flex-no-resize">
												<Wprr.RelatedItem id={relationName} from={Wprr.sourceReference("relation")}>
													<Wprr.CommandButton commands={Wprr.commands.setValue(this._elementTreeItem.getValueSource("mode").reSource(), "value", "edit")}>
														<div className="cursor-pointer">
															{aSlots.default(<Wprr.layout.loader.DataRangeLoader path={Wprr.sourceCombine("range/?select=idSelection,anyStatus&encode=postTitle,postStatus&ids=", Wprr.sourceReference("item", "id"))} as="itemLoader">
																<div>{Wprr.text(Wprr.sourceReference("item", "title"))}</div>
															</Wprr.layout.loader.DataRangeLoader>)}
														</div>
													</Wprr.CommandButton>
												</Wprr.RelatedItem>
												<Wprr.CommandButton commands={Wprr.commands.callFunction(Wprr.sourceReference("valueEditor"), "endRelation", [Wprr.sourceReference("relation", "id")])}>
													<div className="cursor-pointer">
														{React.createElement(Wprr.Image, {"className": "field-icon background-contain", "src": "icons/remove-circle.svg"})}
													</div>
												</Wprr.CommandButton>
											</Wprr.FlexRow>
										</Wprr.layout.ItemList>
									</Wprr.HasData>
									<Wprr.HasData check={Wprr.sourceReference("valueEditor", "item.activeRelations.idsSource")} checkType="invert/notEmpty">
										<Wprr.CommandButton commands={Wprr.commands.setValue(this._elementTreeItem.getValueSource("mode").reSource(), "value", "edit")}>
											<div className="cursor-pointer">{Wprr.idText("Select", "site.select")}</div>
										</Wprr.CommandButton>
									</Wprr.HasData>
								</div>
							</div>
							<div data-section-name="edit">
								<div className="standard-field standard-field-padding full-width">
									<Wprr.FlexRow className="small-item-spacing vertically-center-items" itemClasses="flex-resize,flex-no-resize">
										<Wprr.FormField autoFocus={true} value={this._elementTreeItem.getValueSource("search")} className="integrated-field full-size"/>
										<Wprr.CommandButton commands={Wprr.commands.setValue(this._elementTreeItem.getValueSource("mode").reSource(), "value", "view")}>
											<div className="cursor-pointer">
												{React.createElement(Wprr.Image, {"className": "field-icon background-contain", "src": "icons/remove-circle.svg"})}
											</div>
										</Wprr.CommandButton>
									</Wprr.FlexRow>
								</div>
								<div className="absolute-container">
									<Wprr.layout.area.Overlay open={true}>
										<div className="autocomplete-popup">
											<Wprr.HasData check={this._elementTreeItem.getLinks("sortedItems").idsSource} checkType="notEmpty">
												<Wprr.layout.ItemList ids={this._elementTreeItem.getLinks("sortedItems").idsSource}>
													<Wprr.CommandButton commands={[
														Wprr.commands.callFunction(Wprr.sourceReference("selectedEditor"), "setValue", [Wprr.sourceReference("item", "id")]),
														Wprr.commands.setValue(this._elementTreeItem.getValueSource("mode").reSource(), "value", "view")
													]}>
														<div className="hover-row cursor-pointer standard-row-padding">
															{aSlots.slot("searchResult", Wprr.text(Wprr.sourceReference("item", searchResultField)))}
														</div>
													</Wprr.CommandButton>
												</Wprr.layout.ItemList>
											</Wprr.HasData>
											<Wprr.HasData check={this._elementTreeItem.getLinks("sortedItems").idsSource} checkType="invert/notEmpty">
												<div className="standard-row-padding">
													{Wprr.idText("No results", "site.noResults")}
												</div>
											</Wprr.HasData>
											<Wprr.HasData check={allowCreation}>
												<Wprr.HasData check={this._elementTreeItem.getValueSource("search")} checkType="notEmpty">
													<div className="standard-row-padding">
														<Wprr.layout.interaction.Button 
															commands={[
																Wprr.commands.callFunction(this, this._createItem),
																Wprr.commands.setValue(this._elementTreeItem.getValueSource("mode").reSource(), "value", "view")
															]}
															className="standard-button standard-button-padding text-align-center"
														>
															<Wprr.TextWithReplacements 
																text={Wprr.sourceTranslation("Create \"{objectType}\"", "site.createObjectType")}
																replacements={{
																	"{objectType}": this._elementTreeItem.getValueSource("search")
																}}
																sourceUpdates={this._elementTreeItem.getValueSource("search")}
															/>
														</Wprr.layout.interaction.Button>
													</div>
												</Wprr.HasData>
											</Wprr.HasData>
										</div>
									</Wprr.layout.area.Overlay>
								</div>
							</div>
						</Wprr.SelectSection>
						<Wprr.layout.admin.editorsgroup.SaveValueChanges />
					</div>
				</Wprr.AddReference>
			</Wprr.AddReference>
		);
	}
}
