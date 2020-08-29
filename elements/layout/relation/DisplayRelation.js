"use strict";

import React from "react";
import Wprr from "wprr";

import Layout from "wprr/elements/layout/Layout";

// import DisplayRelation from "./DisplayRelation";
export default class DisplayRelation extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("DisplayRelation::constructor");

		super();
		
		this._layoutName = "displayRelation";
	}
	
	_getLayout(aSlots) {
		
		return <div className="object-relation">
			<div className="flex-row pixel-item-spacing vertically-center-items">
				{aSlots.slot("idCell", <div className="flex-row-item">
					<div className="standard-flag standard-flag-padding id-flag">{Wprr.text(Wprr.sourceReference("item", "id"))}</div>
				</div>)}
				{aSlots.slot("fromCell", <div className="flex-row-item">
					<Wprr.RelatedItem id="from.linkedItem">
						<div>{Wprr.text(Wprr.sourceReference("item", "data.title"))}</div>
					</Wprr.RelatedItem>
				</div>)}
				{aSlots.slot("arrow", <div className="flex-row-item">
					<div>-&gt;</div>
				</div>)}
				{aSlots.slot("toCell", <div className="flex-row-item">
					<Wprr.RelatedItem id="to.linkedItem">
						<div>{Wprr.text(Wprr.sourceReference("item", "data.title"))}</div>
					</Wprr.RelatedItem>
				</div>)}
				{aSlots.slot("statusCell", <Wprr.HasData check={Wprr.sourceStatic(Wprr.sourceReference("item", "editStorage"), "status")} checkType="equal" compareValue="draft">
					<div className="flex-row-item">
						<div className="standard-flag standard-flag-padding status-flag draft">
							Draft
						</div>
					</div>
				</Wprr.HasData>)}
				{aSlots.slot("startFlagCell", <Wprr.HasData check={Wprr.sourceStatic(Wprr.sourceReference("item", "editStorage"), "startAt")} checkType="positiveValue">
					<div className="flex-row-item">
						<div className="standard-flag standard-flag-padding start-at-flag">Start: <Wprr.DateDisplay date={Wprr.sourceStatic(Wprr.sourceReference("item", "editStorage"), "startAt")} format="Y-MM-DD HH:mm:ss" inputType="php" /></div>
					</div>
				</Wprr.HasData>)}
				{aSlots.slot("endFlagCell", <Wprr.HasData check={Wprr.sourceStatic(Wprr.sourceReference("item", "editStorage"), "endAt")} checkType="positiveValue">
					<div className="flex-row-item">
						<div className="standard-flag standard-flag-padding end-at-flag">End: <Wprr.DateDisplay date={Wprr.sourceStatic(Wprr.sourceReference("item", "editStorage"), "endAt")} format="Y-MM-DD HH:mm:ss" inputType="php" /></div>
					</div>
				</Wprr.HasData>)}
			</div>
		</div>;
	}
}