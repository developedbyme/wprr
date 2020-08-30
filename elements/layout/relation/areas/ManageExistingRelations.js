"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";


// import ManageExistingRelations from "./ManageExistingRelations";
export default class ManageExistingRelations extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("ManageExistingRelations::constructor");

		super();
		
		this._layoutName = "manageExistingRelations";
	}
	
	_getLayout(aSlots) {
		
		let editorSource = Wprr.sourceReference("editor");
		let activatePathSource = editorSource.deeper("activePath");
		let externalStorageSource = editorSource.deeper("externalStorage");
		let activeIds = externalStorageSource.deeper(activatePathSource);
		
		return <div className="manage-existing-relations custom-selection-menu-padding content-text-small">
			<Wprr.layout.ItemList ids={activeIds}>
				<Wprr.FlexRow className="small-item-spacing" itemClasses="flex-resize,flex-no-resize">
					<Wprr.layout.relation.DisplayRelation>
						<div data-slot="idCell" />
						<div data-slot="arrow" />
						<div data-slot="fromCell" />
						<div data-slot="startFlagCell" />
						<div data-slot="endFlagCell" />
					</Wprr.layout.relation.DisplayRelation>
					<Wprr.CommandButton commands={[
						Wprr.commands.callFunction(editorSource, "endRelationNow", [Wprr.sourceReference("item", "id")])
					]}>
						<div className="edit-button edit-button-padding pointer-cursor">{Wprr.translateText("Remove")}</div>
					</Wprr.CommandButton>
				</Wprr.FlexRow>
			</Wprr.layout.ItemList>
			<div className="spacing small" />
			<Wprr.FlexRow>
				<Wprr.CommandButton commands={Wprr.commands.setValue(Wprr.sourceReference("value/path"), "path", "add")}>
					<div className="edit-button edit-button-padding cursor-pointer">{Wprr.translateText("Add")}</div>
				</Wprr.CommandButton>
			</Wprr.FlexRow>
		</div>;
	}
}