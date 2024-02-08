"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

// import EditPage from "./EditPage";
export default class EditPage extends Layout {

	/**
	 * Constructor
	 */
	_construct() {
		//console.log("EditPage::constructor");

		super._construct();
		
		this._layoutName = "editPage";
		
		this._keyPressedBound = null;
		
		this._elementTreeItem.requireValue("open", false);
		
	}
	
	_keyPressed(aEvent) {
		//console.log("EditPage::_keyPressed");
		//console.log(aEvent);
		
		if(aEvent.keyCode === 27) {
			this._elementTreeItem.setValue("open", !this._elementTreeItem.getValue("open"));
		}
	}
	
	_startListeners() {
		//console.log("EditPage::_startListeners");
		
		if(!this._keyPressedBound) {
			this._keyPressedBound = this._keyPressed.bind(this);
			
			window.document.addEventListener("keydown", this._keyPressedBound, true);
		}
		
	}
	
	_stopListeners() {
		//console.log("EditPage::_stopListeners");
		
		if(this._keyPressedBound) {
			window.document.removeEventListener("keydown", this._keyPressedBound, true);
			this._keyPressedBound = null;
		}
	}
	
	_createChildPage(aParentId, aPostType = "page") {
		let project = this.getFirstInput(Wprr.sourceReference("wprr/project"));
		
		let loader = project.getCreateLoader(aPostType, null, "draft", "New page");
		
		loader.changeData.setParent(aParentId);
		
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this._pageCreated, [Wprr.sourceEvent("data.id")]));
		
		loader.load();
	}
	
	_pageCreated(aId) {
		//console.log("_pageCreated");
		
		let wpUrl = this.getFirstInput(Wprr.sourceReference("projectLinks", "wp/site/wp-admin/post.php?post=" + aId + "&action=edit"));
		
		wprr.navigate(wpUrl);
	}
	
	_getLayout(aSlots) {
		
		let id = this.getFirstInput("id", Wprr.sourceReference("wprr/pageItem", "post.id"));
		
		let wpUrl = this.getFirstInput(Wprr.sourceReference("projectLinks", "wp/site/wp-admin/post.php?post=" + id + "&action=edit"));
		let exploreUrl = this.getFirstInput(Wprr.sourceReference("projectLinks", "wp/site/admin/items/item/?id=" + id)); 
		
		return React.createElement("div", {"className": "centered-site"},
			React.createElement(Wprr.UserRoleSection, {},
				React.createElement(Wprr.BaseObject, {"data-section-name": "administrator", "didMountCommands": [Wprr.commands.callFunction(this, this._startListeners)], "willUnmountCommands": [Wprr.commands.callFunction(this, this._stopListeners)]},
					React.createElement(Wprr.OpenCloseExpandableArea, {"open": this._elementTreeItem.getValueSource("open")},
						React.createElement("div", {"className": "spacing standard"}),
						React.createElement("div", {},
							React.createElement(Wprr.FlexRow, {"className": "small-item-spacing halfs flex-no-wrap"},
								React.createElement("div", {},
									React.createElement(Wprr.FlexRow, {"className": "small-item-spacing"},
										React.createElement(Wprr.Link, {"href": wpUrl},
											Wprr.idText("Edit in WordPress", "site.editInWordPress")
										),
										React.createElement(Wprr.Link, {"href": exploreUrl},
											Wprr.idText("Explore item", "site.exploreItem")
										)
									),
									React.createElement("div", {"className": "spacing small"}),
									React.createElement(Wprr.layout.admin.editorsgroup.editors.EditorsGroup, {},
										React.createElement(Wprr.layout.admin.editorsgroup.SaveAllGroup, {},
											React.createElement(Wprr.layout.loader.DataRangeLoader, {path: Wprr.sourceCombine("range/?select=idSelection,anyStatus&encode=fields,relations&ids=", id), as: "itemLoader"},
												React.createElement(Wprr.layout.form.LabelledArea, {"label": "Page settings"},
													React.createElement(Wprr.AddReference, {"data": Wprr.sourceFunction(Wprr.sourceReference("editorsGroup"), "getItemEditor", [id]), "as":"itemEditor"},
														React.createElement(Wprr.layout.admin.editorsgroup.editors.SelectRelation, {direction: "incoming", relationType: "for", objectType: "settings/page-settings"})
													)
												),
												React.createElement("div", {"className": "spacing small"}),
												React.createElement(Wprr.layout.form.LabelledArea, {"label": "Data sources"},
													React.createElement(Wprr.AddReference, {"data": Wprr.sourceFunction(Wprr.sourceReference("editorsGroup"), "getItemEditor", [id]), "as":"itemEditor"},
														React.createElement(Wprr.layout.admin.editorsgroup.editors.SelectRelations, {direction: "incoming", relationType: "for", objectType: "settings/data-source", allowCreation: false})
													)
												)
											)
										)
									)
								),
								React.createElement("div", {},
									React.createElement(Wprr.layout.loader.DataRangeLoader, {"path": Wprr.sourceCombine("range/?select=parentsOf,anyStatus&encode=preview&fromIds=", id), "as": "parentsLoader"},
										React.createElement(Wprr.HasData, {"check": Wprr.sourceReference("parentsLoader", "range.ids"), "checkType": "notEmpty"},
											React.createElement(Wprr.layout.form.LabelledArea, {"label": "Parent pages"},
												React.createElement(Wprr.layout.ItemList, {
													"ids": Wprr.sourceReference("parentsLoader", "range.ids"),
													"className": "standard-alternating-rows"
												},
													React.createElement("div", {"className": "standard-row hover-row"}, 
														React.createElement(Wprr.Link, {"href": Wprr.sourceReference("item", "permalink"), "className": "custom-styled-link"},
															React.createElement("div", {"className": "standard-row-padding"}, 
																Wprr.text(Wprr.sourceReference("item", "title"))
															)
														)
													)
												)
											)
										)
									),
									React.createElement("div", {"className": "spacing small"}),
									React.createElement(Wprr.layout.loader.DataRangeLoader, {"path": Wprr.sourceCombine("range/?select=childrenOf,includePrivate,includeDraft&encode=preview&fromIds=", id), "as": "parentsLoader"},
										React.createElement(Wprr.layout.form.LabelledArea, {"label": "Child pages"},
											React.createElement(Wprr.layout.ItemList, {
												"ids": Wprr.sourceReference("parentsLoader", "range.ids"),
												"className": "standard-alternating-rows"
											},
												React.createElement("div", {"className": "standard-row hover-row"}, 
													React.createElement(Wprr.Link, {"href": Wprr.sourceReference("item", "permalink"), "className": "custom-styled-link"},
														React.createElement("div", {"className": "standard-row-padding"}, 
															Wprr.text(Wprr.sourceReference("item", "title"))
														)
													)
												)
											),
											React.createElement("div", {"className": "spacing small"}),
											React.createElement(Wprr.FlexRow, {"className": "small-item-spacing"},
												React.createElement(Wprr.layout.interaction.Button, {
													"className": "button edit-button edit-button-padding add-button cursor-pointer",
													"commands": Wprr.commands.callFunction(this, this._createChildPage, [id]),
													"text": Wprr.sourceTranslation("Create child page", "site.createChildPage")
												})
											)
										)
									)
								)
							)
						),
						React.createElement("div", {"className": "spacing standard"})
					)
				)
			)
		);
	}
}