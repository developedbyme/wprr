"use strict";

import React from "react";
import Wprr from "wprr";
import moment from "moment";

// import EditItemProperties from "./EditItemProperties";
export default class EditItemProperties extends Wprr.BaseObject {
	
	/**
	 * Constructor
	 */
	_construct() {
		//console.log("EditItemProperties::constructor");
		
		super._construct();
		
		let editorsGroup = this._elementTreeItem.addNode("editorsGroup", new Wprr.utils.data.multitypeitems.controllers.admin.EditorsGroup());
	}
	
	_renderMainElement() {
		//console.log("EditItemProperties::_renderMainElement");
		
		let editorsGroup = Wprr.objectPath(this._elementTreeItem, "editorsGroup.linkedItem.editorsGroup");
		let itemId = this.getFirstInput(Wprr.sourceReference("item", "id"), Wprr.sourceQueryString("id"));
		
		return <div>
			<Wprr.AddReference data={this._elementTreeItem} as="editorItem">
				<Wprr.AddReference data={editorsGroup} as="editorsGroup">
					<Wprr.AddReference data={Wprr.sourceStatic(this._elementTreeItem, "table.linkedItem")} as="table">
						<Wprr.layout.loader.DataRangeLoader path={Wprr.sourceCombine("range/?select=idSelection,anyStatus&encode=fields,relations&ids=", itemId)} as="itemLoader">
							<div>
								<Wprr.AddReference data={Wprr.sourceFunction(editorsGroup, editorsGroup.getItemEditor, [itemId])} as="itemEditor">
									<Wprr.layout.admin.editorsgroup.editors.ObjectProperties />
								</Wprr.AddReference>
		
								<div className="spacing standard" />
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
						</Wprr.layout.loader.DataRangeLoader>
					</Wprr.AddReference>
				</Wprr.AddReference>
			</Wprr.AddReference>
		</div>;
	}
	
	static getWpAdminEditor() {
		//console.log("getWpAdminEditor");
		
		let dataSettings = {
			
		};
		
		return <Wprr.layout.admin.WpBlockEditor dataSettings={dataSettings}>
			<div>
				
			</div>
		</Wprr.layout.admin.WpBlockEditor>
	}
}