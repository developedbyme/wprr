import React from 'react';
import Wprr from "wprr";
import objectPath from 'object-path';

let cacheValue = (new Date()).valueOf();

//import CartCondition from "./CartCondition";
export default class CartCondition extends Wprr.BaseObject {

	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		//console.log("CartCondition::_renderMainElement");
		
		let cartUrl = Wprr.utils.wprrUrl.getCartUrl();
		cartUrl = Wprr.utils.url.addQueryString(cartUrl, "sessionVariables", "purchase_type");
		cartUrl = Wprr.utils.url.addQueryString(cartUrl, "cache", cacheValue);
		
		let invert = objectPath.get(this.getReference("blockData"), "invert");
		
		let checkType = "equal";
		if(invert) {
			checkType = "invert/" + checkType;
		}
		
		return <wrapper>
			<Wprr.DataLoader loadData={{"originalCart": cartUrl}}>
				<Wprr.HasData check={Wprr.sourceProp("originalCart", "items")} checkType="notEmpty">
					<Wprr.HasData check={Wprr.sourceProp("originalCart", "session.purchase_type")} checkType={checkType} compareValue={Wprr.sourceReference("blockData", "purchaseType")}>
						<div>
							<Wprr.ContentsAndInjectedComponents content={Wprr.sourceReference("blockData", "innerMarkup")}/>
						</div>
					</Wprr.HasData>
				</Wprr.HasData>
			</Wprr.DataLoader>
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
				<Wprr.EditableProps editableProps="purchaseType" externalStorage={Wprr.sourceReference("wprr/wpBlockEditor/externalStorage")}>
					<Wprr.TermSelection valueName="purchaseType" taxonomy="dbm_relation" valueField="slug" subtree="purchase-type" noSelectionLabel={Wprr.sourceTranslation("Typ av varukorg")} />
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
