import React from "react";
import Wprr from "wprr/Wprr";
import moment from "moment";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class SelectAnyRelation extends WprrBaseObject {
	
	_construct() {
		super._construct();
		
		this._elementTreeItem.setValue("mode", "view");
		this._elementTreeItem.setValue("search", "");
		
		this._elementTreeItem.getValueSource("search").addChangeCommand(Wprr.commands.callFunction(this, this._performSearch));
		
		let singleResultLoader = this._elementTreeItem.addNode("singleResultLoader", new Wprr.utils.data.nodes.LoadDataRange());
		
		this._elementTreeItem.getLinks("singleResults").input(singleResultLoader.item.getLinks("items"));
	}
	
	_performSearch() {
		//console.log("_performSearch");
		
		let search = this._elementTreeItem.getValue("search");
		
		let singleResultLoader = Wprr.objectPath(this._elementTreeItem, "singleResultLoader.linkedItem.controller");
		//console.log(singleResultLoader, this._elementTreeItem);
		
		let numericSearch = 1*search;
		
		if(isNaN(numericSearch) || numericSearch != search) {
			singleResultLoader.setUrl(this.getWprrUrl("range/?select=search&encode=postTitle,postStatus,objectTypes&search=" + encodeURIComponent(search), "wprrData"));
		}
		else {
			singleResultLoader.setUrl(this.getWprrUrl("range/?select=idSelection,anyStatus&encode=postTitle,postStatus,objectTypes&ids=" + numericSearch, "wprrData"));
		}
	}
	
	_renderMainElement() {
		//console.log("SelectAnyRelation::_renderMainElement");
		
		let itemEditor = this.getFirstInput("itemEditor", Wprr.sourceReference("itemEditor"));
		let editorsGroup = itemEditor.editorsGroup;
		
		let direction = this.getFirstInputWithDefault("direction", "outgoing");
		let relationType = this.getFirstInputWithDefault("relationType", "pointing-to");
		let relationName = (direction === "outgoing") ? "to.linkedItem" : "from.linkedItem";
		
		return React.createElement("div", null,
			<Wprr.AddReference data={Wprr.sourceFunction(itemEditor, "getRelationEditor", [direction, relationType, "*"])} as="valueEditor">
				<Wprr.AddReference data={Wprr.sourceReference("valueEditor").deeper("singleEditor")} as="selectedEditor">
					<div>
						<Wprr.SelectSection selectedSections={this._elementTreeItem.getValueSource("mode")}>
							<div data-default-section={true}>
								
								<div className="standard-field standard-field-padding full-width">
									<Wprr.HasData check={Wprr.sourceReference("valueEditor", "item.activeRelations.idsSource")} checkType="notEmpty">
										<Wprr.layout.ItemList ids={Wprr.sourceReference("valueEditor", "item.activeRelations.idsSource")} as="relation">
											<Wprr.FlexRow className="small-item-spacing" itemClasses="flex-resize,flex-no-resize">
												<Wprr.RelatedItem id={relationName} from={Wprr.sourceReference("relation")}>
													<Wprr.CommandButton commands={Wprr.commands.setValue(this._elementTreeItem.getValueSource("mode").reSource(), "value", "edit")}>
														<div className="cursor-pointer">
															<Wprr.layout.loader.DataRangeLoader path={Wprr.sourceCombine("range/?select=idSelection,anyStatus&encode=postTitle,postStatus&ids=", Wprr.sourceReference("item", "id"))} as="itemLoader">
																<div>{Wprr.text(Wprr.sourceReference("item", "title"))}</div>
															</Wprr.layout.loader.DataRangeLoader>
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
											<Wprr.layout.ItemList ids={this._elementTreeItem.getLinks("singleResults").idsSource}>
												<Wprr.CommandButton commands={[
													Wprr.commands.callFunction(Wprr.sourceReference("selectedEditor"), "setValue", [Wprr.sourceReference("item", "id")]),
													Wprr.commands.setValue(this._elementTreeItem.getValueSource("mode").reSource(), "value", "view")
												]}>
													<div className="hover-row cursor-pointer standard-row-padding">{Wprr.text(Wprr.sourceReference("item", "title"))} <span className="post-id-description">({Wprr.text(Wprr.sourceReference("item", "id"))})</span></div>
												</Wprr.CommandButton>
											</Wprr.layout.ItemList>
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
