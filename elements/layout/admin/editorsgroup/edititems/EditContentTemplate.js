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
	
	_renderMainElement() {
		//console.log("EditContentTemplate::_renderMainElement");
		
		let editorsGroup = Wprr.objectPath(this._elementTreeItem, "editorsGroup.linkedItem.editorsGroup");
		
		return <div>
			<Wprr.HasData check={this._elementTreeItem.requireSingleLink("item").idSource}>
				<Wprr.AddReference data={this._elementTreeItem} as="editorItem">
					<Wprr.AddReference data={editorsGroup} as="editorsGroup">
						<div>
							<Wprr.SelectItem id={this._elementTreeItem.requireSingleLink("item").idSource} as="item">
								<Wprr.AddReference data={Wprr.sourceFunction(editorsGroup, editorsGroup.getItemEditor, [Wprr.sourceReference("item", "id")])} as="itemEditor">
									<div>
										<Wprr.layout.form.LabelledArea label="Name">
											<Wprr.AddReference data={Wprr.sourceFunction(Wprr.sourceReference("itemEditor"), "getFieldEditor", ["name"])} as="valueEditor">
												<Wprr.FormField className="standard-field standard-field-padding full-width" value={Wprr.sourceReference("valueEditor", "valueSource")} />
												<Wprr.layout.admin.editorsgroup.SaveValueChanges />
											</Wprr.AddReference>
										</Wprr.layout.form.LabelledArea>
										<div className="spacing standard" />
										<Wprr.layout.form.LabelledArea label="Title">
											<Wprr.AddReference data={Wprr.sourceFunction(Wprr.sourceReference("itemEditor"), "getFieldEditor", ["title"])} as="valueEditor">
												<Wprr.FormField className="standard-field standard-field-padding full-width" value={Wprr.sourceReference("valueEditor", "valueSource")} />
												<Wprr.layout.admin.editorsgroup.SaveValueChanges />
												<div className="spacing small" />
												<Wprr.AddReference data={Wprr.sourceReference("valueEditor", "translationsEditor")} as="translationsEditor">
													<div>
														<Wprr.layout.List items={Wprr.sourceReference("translationsEditor", "item.translationEditors.namesSource")}>
															<div>
																<Wprr.FlexRow className="small-item-spacing" itemClasses="flex-no-resize, flex-resize">
																	<div>{Wprr.text(Wprr.sourceReference("loop/item"))}</div>
																	<div>
																		<Wprr.AddReference data={Wprr.sourceFunction(Wprr.sourceReference("translationsEditor"), "getTranslationEditor", [Wprr.sourceReference("loop/item")])} as="valueEditor">
																			<Wprr.FormField className="standard-field standard-field-padding full-width" value={Wprr.sourceReference("valueEditor", "valueSource")} />
																		</Wprr.AddReference>
																	</div>
																</Wprr.FlexRow>
															</div>
															<div data-slot="spacing" className="spacing small" />
														</Wprr.layout.List>
														<div className="spacing small" />
														<Wprr.FlexRow>
														{
															Wprr.DropdownSelection.createSelfContained(
																React.createElement("div", {className: "button edit-button edit-button-padding add-button cursor-pointer"},
																	Wprr.idText("Add translation", "site.addTranslation")
																),
																<div className="custom-selection-menu custom-selection-menu-padding">
																	<Wprr.layout.ItemList ids={this._elementTreeItem.getLinks("languages").idsSource}>
																		<Wprr.CommandButton commands={[
																			Wprr.commands.callFunction(Wprr.sourceReference("translationsEditor"), "addTranslation", [Wprr.sourceReference("item", "identifier")]),
																			Wprr.commands.setValue(Wprr.sourceReference("value/open"), "open", false)
																		]}>
																			<div className="hover-row cursor-pointer standard-row-padding">{Wprr.text(Wprr.sourceReference("item", "name"))}</div>
																		</Wprr.CommandButton>
																	</Wprr.layout.ItemList>
																</div>,
																{"className": "custom-dropdown"}
															)
														}
														</Wprr.FlexRow>
													</div>
												</Wprr.AddReference>
											</Wprr.AddReference>
										</Wprr.layout.form.LabelledArea>
										<div className="spacing standard" />
										<Wprr.layout.form.LabelledArea label="Content">
											<Wprr.AddReference data={Wprr.sourceFunction(Wprr.sourceReference("itemEditor"), "getFieldEditor", ["content"])} as="valueEditor">
												<Wprr.RichTextEditor className="standard-field standard-field-padding full-width" value={Wprr.sourceReference("valueEditor", "valueSource")} />
												<Wprr.layout.admin.editorsgroup.SaveValueChanges />
												<div className="spacing small" />
												<Wprr.AddReference data={Wprr.sourceReference("valueEditor", "translationsEditor")} as="translationsEditor">
													<div>
														<Wprr.layout.List items={Wprr.sourceReference("translationsEditor", "item.translationEditors.namesSource")}>
															<div>
																<Wprr.FlexRow className="small-item-spacing" itemClasses="flex-no-resize, flex-resize">
																	<div>{Wprr.text(Wprr.sourceReference("loop/item"))}</div>
																	<div>
																		<Wprr.AddReference data={Wprr.sourceFunction(Wprr.sourceReference("translationsEditor"), "getTranslationEditor", [Wprr.sourceReference("loop/item")])} as="valueEditor">
																			<Wprr.RichTextEditor className="standard-field standard-field-padding full-width" value={Wprr.sourceReference("valueEditor", "valueSource")} />
																		</Wprr.AddReference>
																	</div>
																</Wprr.FlexRow>
															</div>
															<div data-slot="spacing" className="spacing small" />
														</Wprr.layout.List>
														<div className="spacing small" />
														<Wprr.FlexRow>
														{
															Wprr.DropdownSelection.createSelfContained(
																React.createElement("div", {className: "button edit-button edit-button-padding add-button cursor-pointer"},
																	Wprr.idText("Add translation", "site.addTranslation")
																),
																<div className="custom-selection-menu custom-selection-menu-padding">
																	<Wprr.layout.ItemList ids={this._elementTreeItem.getLinks("languages").idsSource}>
																		<Wprr.CommandButton commands={[
																			Wprr.commands.callFunction(Wprr.sourceReference("translationsEditor"), "addTranslation", [Wprr.sourceReference("item", "identifier")]),
																			Wprr.commands.setValue(Wprr.sourceReference("value/open"), "open", false)
																		]}>
																			<div className="hover-row cursor-pointer standard-row-padding">{Wprr.text(Wprr.sourceReference("item", "name"))}</div>
																		</Wprr.CommandButton>
																	</Wprr.layout.ItemList>
																</div>,
																{"className": "custom-dropdown"}
															)
														}
														</Wprr.FlexRow>
													</div>
												</Wprr.AddReference>
											</Wprr.AddReference>
										</Wprr.layout.form.LabelledArea>
										<div className="spacing standard" />
									</div>
								</Wprr.AddReference>
							</Wprr.SelectItem>
							<Wprr.FlexRow className="justify-between">
								<div />
								<div>
									<Wprr.HasData check={Wprr.sourceReference("editorsGroup", "item.changed")}>
										<div>
											<Wprr.layout.interaction.Button commands={Wprr.commands.callFunction(Wprr.sourceReference("editorsGroup"), "save")}>
												<div>Save all changes</div>
											</Wprr.layout.interaction.Button>
										</div>
									</Wprr.HasData>
									<Wprr.HasData check={Wprr.sourceReference("editorsGroup", "item.changed")} checkType="invert/default">
										<div>
											<div className="standard-button standard-button-padding inactive">
												<div>No changes to save</div>
											</div>
										</div>
									</Wprr.HasData>
								</div>
							</Wprr.FlexRow>
						</div>
					</Wprr.AddReference>
				</Wprr.AddReference>
			</Wprr.HasData>
		</div>;
	}
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		let dataSettings = {
			
		};
		
		return <Wprr.layout.admin.WpBlockEditor dataSettings={dataSettings}>
			<div>
				
			</div>
		</Wprr.layout.admin.WpBlockEditor>
	}
}