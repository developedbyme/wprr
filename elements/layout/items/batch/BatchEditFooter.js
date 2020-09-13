"use strict";

import React from "react";
import Wprr from "wprr";

import Layout from "wprr/elements/layout/Layout";

// import BatchEditFooter from "./BatchEditFooter";
export default class BatchEditFooter extends Layout {
	
	constructor(aProps) {
		super(aProps);
		
		this._layoutName = "batchEditFooter";
	}

	_getLayout(aSlots) {
		return <div>
			<Wprr.FlexRow className="justify-between">
				{aSlots.slot("left",
					<div>
						<Wprr.CommandButton commands={Wprr.commands.callFunction(Wprr.sourceReference("itemsEditor"), "createItem", [])}>
							<div className="standard-button standard-button-padding">
								{Wprr.translateText("Add")}
							</div>
						</Wprr.CommandButton>
					</div>
				)}
				{aSlots.slot("right",
					<Wprr.ExternalStorageProps props="saveAll.hasChanges" externalStorage={Wprr.sourceReference("externalStorage")}>
						<Wprr.HasData check={Wprr.sourcePropWithDots("saveAll.hasChanges")}>
							<Wprr.CommandButton commands={Wprr.commands.callFunction(Wprr.sourceReference("itemsEditor"), "saveAll", [])}>
								<div className="standard-button standard-button-padding">
									{Wprr.translateText("Save all changes")}
								</div>
							</Wprr.CommandButton>
						</Wprr.HasData>
						<Wprr.HasData check={Wprr.sourcePropWithDots("saveAll.hasChanges")} checkType="invert/default">
							<div className="standard-button standard-button-padding inactive">
								{Wprr.translateText("No changes to save")}
							</div>
						</Wprr.HasData>
					</Wprr.ExternalStorageProps>
				)}
			</Wprr.FlexRow>
		</div>;
	}
}
