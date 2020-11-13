import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

export default class Done extends Layout {
	
	constructor(aProps) {
		super(aProps);
		
		this._layoutName = "signInFlow/done";
	}
	
	_getLayout(aSlots) {
		
		let commands = aSlots.prop("commands", Wprr.sourceFirst(Wprr.sourceReference("pathRouter/externalStorage", "data.commands"), []));
		
		return <div className="signup-verification__verified-box">
			{aSlots.default(<Wprr.FlexRow className="vertically-center-items small-item-spacing">
				<div className="signup-verification__check-circle centered-cell-holder">
					<Wprr.Image className="checkmark background-contain" src="checkmark-white-fat.svg" />
				</div>
				{Wprr.idText("You are now signed in", "site.signedId")}
			</Wprr.FlexRow>)}
			<Wprr.BaseObject didMountCommands={commands} />
		</div>;
	}
}
