import React from "react";

import Markup from "wprr/markup/Markup";
import MarkupChildren from "wprr/markup/MarkupChildren";
import OverlayArea from "wprr/elements/area/OverlayArea";
import EditableProps from "wprr/manipulation/EditableProps";

//import OverlayTemplates from "wprr/markup/templates/OverlayTemplates";
export default class OverlayTemplates {
	
	static createOverlayLayer(aTemplate) {
		return <Markup>
			<EditableProps editableProps="overlays" overlays={[]}>
				<OverlayArea template={aTemplate}>
					<MarkupChildren key="children" placement="all" />
				</OverlayArea>
			</EditableProps>
		</Markup>;
	}
	
	static createBlackBackgoundOverlay(aBoxClasses) {
		return <Markup usedPlacements="closeButton">
			<MarkupChildren placement="closeButton">
				<div className="full-size min-screen-height position-absolute overlay-background all-pointer-events" />
			</MarkupChildren>
			<MarkupChildren placement="rest" />
		</Markup>;
	}
}
