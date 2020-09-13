"use strict";

import React from "react";
import Wprr from "wprr";

import Layout from "wprr/elements/layout/Layout";

// import BatchEditHeader from "./BatchEditHeader";
export default class BatchEditHeader extends Layout {
	
	constructor(aProps) {
		super(aProps);
		
		this._layoutName = "batchEditHeader";
	}

	_getLayout(aSlots) {
		return <div>
			<Wprr.FlexRow className="justify-between">
				{aSlots.slot("left",
					<div>
						{aSlots.slot("titleElement",
							<h2 className="batch-edit-title no-margins">
								{Wprr.text(aSlots.prop("title", "Edit items"))}
							</h2>
						)}
						{aSlots.slot("operations",
							<div />
						)}
					</div>
				)}
				{aSlots.slot("right",
					<div>
						{aSlots.slot("searchStorage",
							<Wprr.EditableProps editableProps={aSlots.prop("searchTextValueName", "searchText")} externalStorage={aSlots.prop("externalStorage", Wprr.sourceReference("externalStorage"))}>
								{aSlots.slot("searchField",
									<Wprr.FormField valueName={aSlots.useProp("searchTextValueName")} />
								)}
							</Wprr.EditableProps>
						)}
					</div>
				)}
			</Wprr.FlexRow>
		</div>;
	}
}
