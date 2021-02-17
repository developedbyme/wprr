"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

// import HorizontalMenuItem from "./HorizontalMenuItem";
export default class HorizontalMenuItem extends Layout {

	/**
	 * Constructor
	 */
	constructor() {
		//console.log("HorizontalMenuItem::constructor");

		super();
		
		this._layoutName = "horizontalMenuItem";
		this._open = Wprr.sourceValue(false);
	}
	
	_stateFromOpen(aOpen) {
		return aOpen ? "over" : "initial";
	}
	
	_toggleOpen() {
		this._open.setValue(!this._open.getValue());
	}
	
	_setOpen(aOpen) {
		this._open.setValue(aOpen);
	}
	
	_getLayout(aSlots) {
		
		let menuItem = this.getFirstInput(Wprr.sourceProp("menuItem"));
		let children = menuItem.children;
		
		let link = <Wprr.Adjust adjust={Wprr.adjusts.isUrlAtPath(menuItem.link, null, {"not": "not-active", "at": "active", "in": "child-active"}, "className")}>
			<Wprr.Link href={menuItem.link} className="custom-styled-link menu-link">{Wprr.text(menuItem.title)}</Wprr.Link>
		</Wprr.Adjust>;
		
		if(children.length > 0) {
			
			let childItemMarkup = <div>
				<Wprr.Adjust adjust={Wprr.adjusts.isUrlAtPath(Wprr.sourceReference("loop/item", "link"), null, {"not": "not-active", "at": "active", "in": "not-active"}, "className")}>
					<Wprr.Link href={Wprr.sourceReference("loop/item", "link")} className="custom-styled-link menu-link">{Wprr.text(Wprr.sourceReference("loop/item", "title"))}</Wprr.Link>
				</Wprr.Adjust>
			</div>;
			
			return <div>
				<Wprr.EventCommands events={{
					"onMouseEnter": [Wprr.commands.callFunction(this, this._setOpen, [true])],
					"onMouseLeave": [Wprr.commands.callFunction(this, this._setOpen, [false])],
				}}>
					<div className="absolute-container">
						<div>{link}{" "}<Wprr.Image className="background-contain display-inline-block menu-arrow-adjust" src="chevron-medium.svg" /></div>

						<Wprr.AnimationControl
							states={{
								"initial": {"scale": 0},
								"over": {"scale": 1}
							}}
							state={Wprr.sourceFunction(this, this._stateFromOpen, [this._open])}
							sourceUpdates={this._open}
						>
							<Wprr.AnimationPart animationFunctions={[
								Wprr.utils.applyAnimation.staticTranslate("-50%", "0px"),
								Wprr.utils.applyAnimation.uniformScale()
							]}>
								<div className="position-absolute center-below transform-origin-top-center">
									<Wprr.OpenCloseExpandableArea open={this._open}>
										<div>
											<div className="menu-drop-down-top absolute-container">
												<div className="menu-drop-down-top-arrow" />
											</div>
											<div className="menu-drop-down-box menu-drop-down-box-padding">
												<Wprr.Loop loop={Wprr.adjusts.markupLoop(children, childItemMarkup, <div className="spacing medium" />)} />
											</div>
										</div>
									</Wprr.OpenCloseExpandableArea>
								</div>
							</Wprr.AnimationPart>
						</Wprr.AnimationControl>
					</div>
				</Wprr.EventCommands>
			</div>;
		}
		
		return <div>
			{link}
		</div>;
	}
}