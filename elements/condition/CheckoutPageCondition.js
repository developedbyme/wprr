import React from 'react';
import Wprr from "wprr";
import objectPath from 'object-path';

let cacheValue = (new Date()).valueOf();

//import CheckoutPageCondition from "./CheckoutPageCondition";
export default class CheckoutPageCondition extends Wprr.BaseObject {

	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		//console.log("CheckoutPageCondition::_renderMainElement");
		
		let pageType = objectPath.get(this.getReference("blockData"), "pageType");
		let invert = objectPath.get(this.getReference("blockData"), "invert");
		
		let pageData = this.getReference("wprr/pageData");
		
		let fieldToCheck = null;
		let isType = false;
		switch(pageType) {
			case "checkout":
				fieldToCheck = "is_checkout";
				isType = objectPath.get(pageData, "templateSelection.woocommerce." + fieldToCheck);
				isType &= !objectPath.get(pageData, "templateSelection.woocommerce.is_order_received_page");
				break;
			case "complete":
				fieldToCheck = "is_order_received_page";
				isType = objectPath.get(pageData, "templateSelection.woocommerce." + fieldToCheck);
				break;
		}
		
		let checkType = "default";
		if(invert) {
			checkType = "invert/" + checkType;
		}
		
		return <wrapper>
			<Wprr.HasData check={isType} checkType={checkType}>
				<div>
					<Wprr.ContentsAndInjectedComponents content={Wprr.sourceReference("blockData", "innerMarkup")} parsedContent={Wprr.sourceReference("blockData", "parsedContent")} />
				</div>
			</Wprr.HasData>
		</wrapper>
	}
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		let dataSettings = {
			
		};
		
		return <div>
			<Wprr.FlexRow className="small-item-spacing vertically-center-items" itemClasses="flex-resize,flex-no-resize,flex-resize">
				<hr className="line no-margin"/>
				<div>{Wprr.translateText("Cart condition")}</div>
				<hr className="line no-margin"/>
			</Wprr.FlexRow>
			<Wprr.FlexRow className="small-item-spacing">
				<Wprr.EditableProps editableProps="pageType" externalStorage={Wprr.sourceReference("wprr/wpBlockEditor/externalStorage")}>
					<Wprr.Selection valueName="pageType" options={[
						{"value": "none", "label": "None"},
						{"value": "checkout", "label": "Checkout"},
						{"value": "complete", "label": "Complete"}
					]}
					noSelectionLabel={Wprr.sourceTranslation("Page")} />
				</Wprr.EditableProps>
				<div>
					<Wprr.EditableProps editableProps="invert" externalStorage={Wprr.sourceReference("wprr/wpBlockEditor/externalStorage")}>
						<Wprr.Checkbox className="full-width" valueName="invert" />
					</Wprr.EditableProps>
					<label>{Wprr.translateText("Invertera matchning")}</label>
				</div>
			</Wprr.FlexRow>
			<wp.editor.InnerBlocks />
			<Wprr.FlexRow className="small-item-spacing vertically-center-items" itemClasses="flex-resize,flex-no-resize,flex-resize">
				<hr className="line no-margin"/>
				<div>
					{Wprr.translateText("End:")}
					{" "}
					{Wprr.translateText("Cart condition")}
				</div>
				<hr className="line no-margin"/>
			</Wprr.FlexRow>
		</div>;
	}
}
