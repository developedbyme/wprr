import React from "react";
import Wprr from "wprr";

export default class Done extends Wprr.Layout {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_getLayout(aSlots) {
		
		let commands = aSlots.prop("commands", Wprr.sourceFirst(Wprr.sourceReference("pathRouter/externalStorage", "data.commands"), []));
		
		return <div className="signup-verification__verified-box">
			<Wprr.FlexRow className="vertically-center-items small-item-spacing">
				<div className="signup-verification__check-circle centered-cell-holder">
					<Wprr.Image className="checkmark background-contain" src="checkmark-white-fat.svg" />
				</div>
				{Wprr.translateText("You are now signed in")}
			</Wprr.FlexRow>
			<Wprr.BaseObject didMountCommands={commands} />
		</div>;
	}
}
