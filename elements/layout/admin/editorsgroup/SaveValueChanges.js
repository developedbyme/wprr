import React from "react";
import Wprr from "wprr/Wprr";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class SaveValueChanges extends WprrBaseObject {
	
	_constructor() {
		super._constructor();
	}
	
	_renderMainElement() {
		console.log("SaveValueChanges::_renderMainElement");
		
		let items = this.getFirstInput(Wprr.sourceReference("wprr/project", "items"));
		
		return React.createElement("div", null,
			<Wprr.OpenCloseExpandableArea open={Wprr.sourceReference("valueEditor", "changedSource")}>
				<Wprr.FlexRow className="justify-between">
					<div>
						<Wprr.layout.interaction.Button className="action-link cursor-pointer" commands={Wprr.commands.callFunction(Wprr.sourceReference("valueEditor"), "cancelEdit")}>
							<div>{Wprr.idText("Cancel", "site.cancel")}</div>
						</Wprr.layout.interaction.Button>
					</div>
					<div>
						<Wprr.layout.interaction.Button className="action-link cursor-pointer" commands={Wprr.commands.callFunction(Wprr.sourceReference("valueEditor"), "save")}>
							<div>{Wprr.idText("Save", "site.save")}</div>
						</Wprr.layout.interaction.Button>
					</div>
				</Wprr.FlexRow>
			</Wprr.OpenCloseExpandableArea>
		);
	}
}
