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
	
	_createChildPage() {
		
		let currentPost = this.getFirstInput(Wprr.sourceReference("wprr/pageItem", "post.linkedItem"));
		
		let project = this.getFirstInput(Wprr.sourceReference("wprr/project"));
		
		let loader = project.getCreateLoader(currentPost.getValue("postType"), null, "draft", "New page");
		
		loader.changeData.setParent(currentPost.id);
		
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this._pageCreated, [Wprr.sourceEvent("data.id")]));
		
		loader.load();
	}
	
	_pageCreated(aId) {
		//console.log("_pageCreated");
		
		let wpUrl = this.getFirstInput(Wprr.sourceReference("projectLinks", "wp/site/wp-admin/post.php?post=" + aId + "&action=edit"));
		
		wprr.navigate(wpUrl);
	}
	
	_createTranslation(aItem, aLanguageCode) {
		console.log("_createTranslation");
		let currentTranslation = Wprr.utils.array.getItemBy("language.value", aLanguageCode, aItem.getSingleLink("translations").getLinks("posts").items);
		console.log(currentTranslation);
		
		if(currentTranslation && false) {
			let wpUrl = this.getFirstInput(Wprr.sourceReference("projectLinks", "wp/site/wp-admin/post.php?post=" + currentTranslation.id + "&action=edit"));
		
			//wprr.navigate(wpUrl);
		}
		else {
			let translations = aItem.getSingleLink("translations");
			
			let currentPost = this.getFirstInput(Wprr.sourceReference("wprr/pageItem", "post.linkedItem"));
			console.log(currentPost);
		
			let project = this.getFirstInput(Wprr.sourceReference("wprr/project"));
	
			let loader = project.getCreateLoader(currentPost.getValue("postType"), null, "draft", currentPost.getValue("title"));
			
			loader.changeData.setMeta("language", aLanguageCode);
			loader.changeData.addOutgoingRelation(translations.id, "in");
			
			//loader.changeData.setParent(aParentId);
			//METODO: set parent for translation
	
			loader.addSuccessCommand(Wprr.commands.callFunction(this, this._pageCreated, [Wprr.sourceEvent("data.id")]));
			loader.load();
			
		}
	}
	
	_setupTranslations(aItemEditor) {
		console.log("_setupTranslations");
		
		let project = this._elementTreeItem.group.getItem("project").getType("controller");
		
		let loader = project.getLoader();
		
		let data = {
			"translationsGroup": {
				"amount": 1,
				"types": ["group/translations-group", "group"]
			}
		}
		
		loader.setupJsonPost(this.getWprrUrl("admin/create-posts/", "wprrData"), {"data": data});
		
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this._translationGroupCreated, [Wprr.sourceEvent("data.translationsGroup.0"), aItemEditor]))
		
		loader.load();
	}
	
	_translationGroupCreated(aNewId, aItemEditor) {
		console.log("_translationGroupCreated");
		console.log(aNewId, aItemEditor);
		
		let newItem = this._elementTreeItem.group.getItem(aNewId);
		
		newItem.getLinks("objectTypes").addItem("dbm_type:" + "group/translations-group");
		newItem.getLinks("objectTypes").addItem("dbm_type:" + "group");
		newItem.setValue("status", "draft");
		
		let newItemEditor = aItemEditor.editorsGroup.getItemEditor(newItem.id);
		newItemEditor.getPostStatusEditor().value = "publish";
		
		aItemEditor.getRelationEditor("outgoing", "in", "group/translations-group").multipleEditor.addUniqueItem(newItem.id);
		aItemEditor.getRelationEditor("incoming", "of", "group/translations-group").multipleEditor.addUniqueItem(newItem.id);
		
		
	}
	
	_getUnaddedLanguages(aItem, aLanguages) {
		//METODO
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
				React.createElement(Wprr.layout.admin.editorsgroup.editors.EditorsGroup, {},
					React.createElement(Wprr.layout.admin.editorsgroup.SaveAllGroup, {},
						React.createElement(Wprr.layout.loader.DataRangeLoader, {path: Wprr.sourceCombine("range/?select=idSelection,anyStatus&encode=fields,relations,postTranslation/language&ids=", id), as: "itemLoader"},
							React.createElement(Wprr.AddReference, {"data": Wprr.sourceReference("editorsGroup", "itemEditor." + id), "as":"itemEditor"},
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

									React.createElement(Wprr.layout.form.LabelledArea, {"label": "Page settings"},
										React.createElement(Wprr.layout.admin.editorsgroup.editors.SelectRelation, {direction: "incoming", relationType: "for", objectType: "settings/page-settings"})
									),
									React.createElement("div", {"className": "spacing small"}),
									React.createElement(Wprr.layout.form.LabelledArea, {"label": "Data sources"},
										React.createElement(Wprr.layout.admin.editorsgroup.editors.SelectRelations, {direction: "incoming", relationType: "for", objectType: "settings/data-source", allowCreation: false})
									),
									React.createElement("div", {"className": "spacing small"}),
									React.createElement(Wprr.layout.form.LabelledArea, {"label": "Language"},
										React.createElement(Wprr.AddReference, {"data": Wprr.sourceReference("itemEditor", "metaEditor.language"), "as":"valueEditor"},
											
											React.createElement(Wprr.layout.loader.DataRangeLoader, {path: "range/?select=relation&encode=type&type=type/language", as: "itemLoader"},
												React.createElement(Wprr.Selection, {"className": "full-width", "value": Wprr.sourceReference("valueEditor", "valueSource"), options:
		
													Wprr.sourceFunction(Wprr.utils.KeyValueGenerator, Wprr.utils.KeyValueGenerator.addFirstOption, [
														Wprr.sourceFunction(Wprr.utils.KeyValueGenerator, Wprr.utils.KeyValueGenerator.convertArrayToOptions, [Wprr.sourceReference("itemLoader", "range.items"), "identifier.value", "name.value"]),
														0,
														"Select"
													])
		
												})
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
									),
									React.createElement("div", {"className": "spacing small"}),
									React.createElement(Wprr.layout.loader.DataRangeLoader, {"path": Wprr.sourceCombine("range/?select=idSelection,includePrivate,includeDraft&encode=postTranslation/translations&ids=", id), "as": "translationsLoader"},
										React.createElement(Wprr.layout.loader.DataRangeLoader, {"path": "range/?select=relation&encode=type&type=type/language", "as": "languagesLoader"},
											React.createElement(Wprr.layout.form.LabelledArea, {"label": "Translations"},
												React.createElement(Wprr.SelectItem, {"id": id},
													
													React.createElement(Wprr.layout.ItemList, {
														"ids": Wprr.sourceReference("item", "translations.linkedItem.posts.idsSource"),
														"className": "standard-alternating-rows"
													},
														React.createElement("div", {"className": "standard-row hover-row"}, 
															React.createElement(Wprr.Link, {"href": Wprr.sourceReference("item", "permalink"), "className": "custom-styled-link"},
																React.createElement("div", {"className": "standard-row-padding"}, 
																	Wprr.text(Wprr.sourceReference("item", "language"))
																)
															)
														)
													),
													React.createElement(Wprr.HasData, {"check": Wprr.sourceReference("item", "language"), "checkType": "notEmpty"},
														React.createElement("div", {"className": "spacing small"}),
														React.createElement(Wprr.HasData, {"check": Wprr.sourceReference("item", "translations.idSource")},
															React.createElement(Wprr.FlexRow, null,
																Wprr.DropdownSelection.createSelfContained(
																	React.createElement("div", {className: "button edit-button edit-button-padding add-button cursor-pointer"},
																		Wprr.idText("Create translation", "site.createTranslation")
																	),
																	React.createElement("div", {className: "custom-selection-menu custom-selection-menu-padding"},
																		React.createElement(Wprr.layout.ItemList, {ids: Wprr.sourceReference("languagesLoader", "range.idsSource"), "as": "language"},
																			React.createElement(Wprr.CommandButton, {commands: [Wprr.commands.callFunction(this, this._createTranslation, [Wprr.sourceReference("item"), Wprr.sourceReference("language", "identifier")]), Wprr.commands.setValue(Wprr.sourceReference("value/open"), "open", false)]},
																				React.createElement("div", {className: "hover-row cursor-pointer standard-row-padding"},
																					Wprr.text(Wprr.sourceReference("language", "name"))
																				)
																			)
																		)
																	),
																	{"className": "custom-dropdown"}
																)
															)
														),
														React.createElement(Wprr.HasData, {"check": Wprr.sourceReference("item", "translations.idSource"), "checkType": "invert/default"},
															React.createElement(Wprr.FlexRow, null,
																React.createElement(Wprr.FlexRow, {"className": "small-item-spacing"},
																	React.createElement(Wprr.layout.interaction.Button, {
																		"className": "button edit-button edit-button-padding add-button cursor-pointer",
																		"commands": Wprr.commands.callFunction(this, this._setupTranslations, [Wprr.sourceReference("itemEditor")]),
																		"text": Wprr.sourceTranslation("Setup translation", "site.setupTranslation")
																	})
																)
															)
														)
													)
												)
											)

										)
									)
								)
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