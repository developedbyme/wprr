import React from "react";
import Wprr from "wprr/Wprr";
import moment from "moment";

import WprrBaseObject from "wprr/WprrBaseObject";
import Layout from "wprr/elements/layout/Layout";

export default class SelectRelationsFromItems extends Layout {
	
	_construct() {
		super._construct();
		
		this._elementTreeItem.setValue("mode", "view");
	}
	
	getRelationEditor() {
		let itemEditor = this.getFirstInput("itemEditor", Wprr.sourceReference("itemEditor"));
		
		let direction = this.getFirstInputWithDefault("direction", "incoming");
		let relationType = this.getFirstInputWithDefault("relationType", "for");
		let objectType = this.getFirstInputWithDefault("objectType", "type");
		
		return itemEditor.getRelationEditor(direction, relationType, objectType);
	}
	
	_getLayout(aSlots) {
		//console.log("SelectRelationFromItemss::_renderMainElement");
		
		let itemEditor = this.getFirstInput("itemEditor", Wprr.sourceReference("itemEditor"));
		let editorsGroup = itemEditor.editorsGroup;
		
		let direction = this.getFirstInputWithDefault("direction", "incoming");
		let relationType = this.getFirstInputWithDefault("relationType", "for");
		let objectType = this.getFirstInputWithDefault("objectType", "type");
		let relationName = (direction === "outgoing") ? "to.linkedItem" : "from.linkedItem";
		
		return React.createElement("div", null,
			<Wprr.AddReference data={Wprr.sourceFunction(itemEditor, "getRelationEditor", [direction, relationType, objectType])} as="valueEditor">
			
					<div>
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
						<Wprr.SelectSection selectedSections={this._elementTreeItem.getValueSource("mode")}>
							<div data-default-section={true}>
								
							</div>
							<div data-section-name="edit">
								<div className="absolute-container">
									<Wprr.layout.area.Overlay open={true}>
										<div className="autocomplete-popup">
											<Wprr.layout.ItemList ids={this.getFirstInput("ids")}>
												<Wprr.CommandButton commands={[
													Wprr.commands.callFunction(Wprr.sourceReference("valueEditor"), "createRelation", [Wprr.sourceReference("item", "id")]),
													Wprr.commands.setValue(this._elementTreeItem.getValueSource("mode").reSource(), "value", "view")
												]}>
													<div className="hover-row cursor-pointer standard-row-padding">
														{aSlots.slot("searchResult",
															<div>{Wprr.text(Wprr.sourceReference("item", "id"))}</div>
														)}
													</div>
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
		);
	}
}
