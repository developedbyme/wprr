"use strict";

import React from "react";
import Wprr from "wprr";
import moment from "moment";

// import EditContentTemplate from "./EditContentTemplate";
export default class EditContentTemplate extends Wprr.BaseObject {
	
	/**
	 * Constructor
	 */
	_construct() {
		//console.log("EditContentTemplate::constructor");
		
		super._construct();
		
		let editorsGroup = this._elementTreeItem.addNode("editorsGroup", new Wprr.utils.data.multitypeitems.controllers.admin.EditorsGroup());
		
		let id = this.getFirstInput(Wprr.sourceReference("item", "id"), Wprr.sourceQueryString("id"));
		
		let loader = this._elementTreeItem.createNode("loader", "loadDataRange");
		this._elementTreeItem.requireSingleLink("item").idSource.input(loader.item.requireSingleLink("singleItem").idSource);
		loader.setUrl(this.getWprrUrl("range/?select=idSelection,anyStatus&encode=fields,fields/translations,relations&ids=" + id, "wprrData"));
		
		let languageLoader = this._elementTreeItem.createNode("languageLoader", "loadDataRange");
		this._elementTreeItem.getLinks("languages").input(languageLoader.item.getLinks("items"));
		languageLoader.setUrl(this.getWprrUrl("range/?select=relation&encode=type&type=type/language", "wprrData"));
	}
	
	_copyValue(aFromEditor, aToEditor) {
		//console.log("_copyTranslations");
		//console.log(aFromEditor, aToEditor);
		
		aToEditor.value = aFromEditor.value;
	}
	
	_copyTranslations(aFromEditor, aToEditor) {
		//console.log("_copyTranslations");
		//console.log(aFromEditor, aToEditor);
		
		let translationCodes = aFromEditor.getTranslationCodes();
		
		let currentArray = translationCodes;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentCode = currentArray[i];
			aToEditor.getTranslationEditor(currentCode).value = aFromEditor.getTranslationEditor(currentCode).value;
		}
	}
	
	_renderMainElement() {
		//console.log("EditContentTemplate::_renderMainElement");
		
		let editorsGroup = Wprr.objectPath(this._elementTreeItem, "editorsGroup.linkedItem.editorsGroup");
		
		return React.createElement("div", null,
			React.createElement(Wprr.HasData, {check: this._elementTreeItem.requireSingleLink("item").idSource},
				React.createElement(Wprr.AddReference, {data: this._elementTreeItem, as: "editorItem"},
					React.createElement(Wprr.AddReference, {data: editorsGroup, as: "editorsGroup"},
						React.createElement("div", null,
							React.createElement(Wprr.SelectItem, {id: this._elementTreeItem.requireSingleLink("item").idSource, as: "item"},
								React.createElement(Wprr.AddReference, {data: Wprr.sourceFunction(editorsGroup, editorsGroup.getItemEditor, [Wprr.sourceReference("item", "id")]), as: "itemEditor"},
									React.createElement("div", null,
										React.createElement(Wprr.layout.form.LabelledArea, {label: "Name"},
											React.createElement(Wprr.AddReference, {data: Wprr.sourceFunction(Wprr.sourceReference("itemEditor"), "getFieldEditor", ["name"]), as: "valueEditor"},
												React.createElement(Wprr.FormField, {className: "standard-field standard-field-padding full-width", value: Wprr.sourceReference("valueEditor", "valueSource")}),
												React.createElement(Wprr.layout.admin.editorsgroup.SaveValueChanges, null)
											)
										),
										React.createElement("div", {className: "spacing standard"}),
										React.createElement(Wprr.layout.form.LabelledArea, {label: "Title"},
											React.createElement(Wprr.AddReference, {data: Wprr.sourceFunction(Wprr.sourceReference("itemEditor"), "getFieldEditor", ["title"]), as: "valueEditor"},
												React.createElement(Wprr.FormField, {className: "standard-field standard-field-padding full-width", value: Wprr.sourceReference("valueEditor", "valueSource")}),
												React.createElement(Wprr.layout.admin.editorsgroup.SaveValueChanges, null),
												React.createElement("div", {className: "spacing small"}),
												React.createElement(Wprr.AddReference, {data: Wprr.sourceReference("valueEditor", "translationsEditor"), as: "translationsEditor"},
													React.createElement("div", null,
														React.createElement(Wprr.layout.List, {items: Wprr.sourceReference("translationsEditor", "item.translationEditors.namesSource")},
															React.createElement("div", null,
																React.createElement(Wprr.FlexRow, {className: "small-item-spacing", itemClasses: "flex-no-resize, flex-resize"},
																	React.createElement("div", null,
																		Wprr.text(Wprr.sourceReference("loop/item"))
																	),
																	React.createElement("div", null, 
																		React.createElement(Wprr.AddReference, {data: Wprr.sourceFunction(Wprr.sourceReference("translationsEditor"), "getTranslationEditor", [Wprr.sourceReference("loop/item")]), as: "valueEditor"},
																			React.createElement(Wprr.FormField, {className: "standard-field standard-field-padding full-width", value: Wprr.sourceReference("valueEditor", "valueSource")})
																		)
																	)
																)
															),
															React.createElement("div", {"data-slot": "spacing", className: "spacing small"})
														),
														React.createElement("div", {className: "spacing small"}),
														React.createElement(Wprr.FlexRow, null,
															Wprr.DropdownSelection.createSelfContained(
																React.createElement("div", {className: "button edit-button edit-button-padding add-button cursor-pointer"}, Wprr.idText("Add translation", "site.addTranslation")),
																React.createElement("div", {className: "custom-selection-menu custom-selection-menu-padding"},
																	React.createElement(Wprr.layout.ItemList, {ids: this._elementTreeItem.getLinks("languages").idsSource},
																		React.createElement(Wprr.CommandButton, {commands: [Wprr.commands.callFunction(Wprr.sourceReference("translationsEditor"), "addTranslation", [Wprr.sourceReference("item", "identifier")]), Wprr.commands.setValue(Wprr.sourceReference("value/open"), "open", false)]},
																			React.createElement("div", {className: "hover-row cursor-pointer standard-row-padding"}, Wprr.text(Wprr.sourceReference("item", "name")))
																		)
																	)
																),
																{"className": "custom-dropdown"}
															)
														)
													)
												)
											)
										),
										React.createElement("div", {className: "spacing standard"}),
										React.createElement(Wprr.layout.form.LabelledArea, {label: "Content"},
											React.createElement(Wprr.AddReference, {data: Wprr.sourceFunction(Wprr.sourceReference("itemEditor"), "getFieldEditor", ["content"]), as: "valueEditor"},
												React.createElement(Wprr.RichTextEditor, {className: "standard-field standard-field-padding full-width", value: Wprr.sourceReference("valueEditor", "valueSource")}),
												React.createElement(Wprr.layout.admin.editorsgroup.SaveValueChanges, null),
												React.createElement("div", {className: "spacing small"}),
												React.createElement(Wprr.AddReference, {data: Wprr.sourceReference("valueEditor", "translationsEditor"), as: "translationsEditor"},
													React.createElement("div", null,
														React.createElement(Wprr.layout.List, {items: Wprr.sourceReference("translationsEditor", "item.translationEditors.namesSource")},
															React.createElement("div", null,
																React.createElement(Wprr.FlexRow, {className: "small-item-spacing", itemClasses: "flex-no-resize, flex-resize"},
																	React.createElement("div", null,
																		Wprr.text(Wprr.sourceReference("loop/item"))
																	),
																	React.createElement("div", null,
																		React.createElement(Wprr.AddReference, {data: Wprr.sourceFunction(Wprr.sourceReference("translationsEditor"), "getTranslationEditor", [Wprr.sourceReference("loop/item")]), as: "valueEditor"},
																			React.createElement(Wprr.RichTextEditor, {className: "standard-field standard-field-padding full-width", value: Wprr.sourceReference("valueEditor", "valueSource")})
																		)
																	)
																)
															),
															React.createElement("div", {"data-slot": "spacing", className: "spacing small"})
														),
														React.createElement("div", {className: "spacing small"}),
														React.createElement(Wprr.FlexRow, null,
															Wprr.DropdownSelection.createSelfContained(
																React.createElement("div", {className: "button edit-button edit-button-padding add-button cursor-pointer"},
																	Wprr.idText("Add translation", "site.addTranslation")
																),
																React.createElement("div", {className: "custom-selection-menu custom-selection-menu-padding"},
																	React.createElement(Wprr.layout.ItemList, {ids: this._elementTreeItem.getLinks("languages").idsSource},
																		React.createElement(Wprr.CommandButton, {commands: [Wprr.commands.callFunction(Wprr.sourceReference("translationsEditor"), "addTranslation", [Wprr.sourceReference("item", "identifier")]),
																			Wprr.commands.setValue(Wprr.sourceReference("value/open"), "open", false)]},
																				React.createElement("div", {className: "hover-row cursor-pointer standard-row-padding"},
																					Wprr.text(Wprr.sourceReference("item", "name")
																				)
																			)
																		)
																	)
																),
																{"className": "custom-dropdown"}
															)
														)
													)
												)
											)
										),
										React.createElement("div", {className: "spacing standard"})
									),
									React.createElement("div", {},
									React.createElement(Wprr.AddReference, {
									  data: Wprr.sourceReference("itemEditor"),
									  as: "mainItemEditor"
									}, /*#__PURE__*/React.createElement(Wprr.layout.admin.editorsgroup.editors.Relations, {
									  direction: "outgoing",
									  relationType: "based-on",
									  objectType: "content-template"
									}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.layout.loader.DataRangeLoader, {
									  path: Wprr.sourceCombine("range/?select=idSelection,anyStatus&encode=relations,fields,postTitle,fields/translations&ids=", Wprr.sourceReference("item", "id")),
									  as: "itemLoader"
									}, /*#__PURE__*/React.createElement(Wprr.AddReference, {
									  data: Wprr.sourceFunction(editorsGroup, editorsGroup.getItemEditor, [Wprr.sourceReference("item", "id")]),
									  as: "itemEditor"
									}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, "Based on ", /*#__PURE__*/React.createElement(Wprr.Link, {
									  href: Wprr.sourceCombine(Wprr.sourceReference("projectLinks", "wp/site/admin/content-templates/content-template/"), "?id=", Wprr.sourceReference("item", "id"))
									}, Wprr.text(Wprr.sourceReference("item", "title")))), /*#__PURE__*/React.createElement(Wprr.FlexRow, {
									  className: "micro-item-spacing"
									}, /*#__PURE__*/React.createElement(Wprr.layout.interaction.Button, {
									  className: "edit-button edit-button-padding cursor-pointer",
									  commands: Wprr.commands.callFunction(this, this._copyValue, [Wprr.sourceReference("itemEditor", "fieldEditor.title"), Wprr.sourceReference("mainItemEditor", "fieldEditor.title")]),
									  text: Wprr.sourceTranslation("Copy title", "site.copyTitle")
									}), /*#__PURE__*/React.createElement(Wprr.layout.interaction.Button, {
									  className: "edit-button edit-button-padding cursor-pointer",
									  commands: Wprr.commands.callFunction(this, this._copyTranslations, [Wprr.sourceReference("itemEditor", "fieldEditor.title.translationsEditor"), Wprr.sourceReference("mainItemEditor", "fieldEditor.title.translationsEditor")]),
									  text: Wprr.sourceTranslation("Copy title translations", "site.copyTitleTranslations")
									}), /*#__PURE__*/React.createElement(Wprr.layout.interaction.Button, {
									  className: "edit-button edit-button-padding cursor-pointer",
									  commands: Wprr.commands.callFunction(this, this._copyValue, [Wprr.sourceReference("itemEditor", "fieldEditor.content"), Wprr.sourceReference("mainItemEditor", "fieldEditor.content")]),
									  text: Wprr.sourceTranslation("Copy content", "site.copyContent")
									}), /*#__PURE__*/React.createElement(Wprr.layout.interaction.Button, {
									  className: "edit-button edit-button-padding cursor-pointer",
									  commands: Wprr.commands.callFunction(this, this._copyTranslations, [Wprr.sourceReference("itemEditor", "fieldEditor.content.translationsEditor"), Wprr.sourceReference("mainItemEditor", "fieldEditor.content.translationsEditor")]),
									  text: Wprr.sourceTranslation("Copy content translations", "site.copyContentTranslations")
									}))))))))
									)
								)
							),
							React.createElement(Wprr.FlexRow, {className: "justify-between"},
								React.createElement("div", null),
								React.createElement("div", null,
									React.createElement(Wprr.HasData, {check: Wprr.sourceReference("editorsGroup", "item.changed")},
										React.createElement("div", null,
											React.createElement(Wprr.layout.interaction.Button, {commands: Wprr.commands.callFunction(Wprr.sourceReference("editorsGroup"), "save")},
												React.createElement("div", null, "Save all changes")
											)
										)
									),
									React.createElement(Wprr.HasData, {check: Wprr.sourceReference("editorsGroup", "item.changed"), checkType: "invert/default"},
										React.createElement("div", null,
											React.createElement("div", {className: "standard-button standard-button-padding inactive"},
												React.createElement("div", null, "No changes to save")
											)
										)
									)
								)
							)
						)
					)
				)
			)
		);
	}
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		let dataSettings = {
			
		};
		
		return React.createElement(Wprr.layout.admin.WpBlockEditor, {dataSettings: dataSettings},
			React.createElement("div", null)
		);
	}
}