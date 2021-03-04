import React from 'react';
import Wprr from "wprr";
import objectPath from 'object-path';
import queryString from "query-string";

//import CompletedOrderCondition from "./CompletedOrderCondition";
export default class CompletedOrderCondition extends Wprr.BaseObject {

	constructor(aProps) {
		super(aProps);
	}
	
	_renderMainElement() {
		//console.log("CompletedOrderCondition::_renderMainElement");
		
		let parts = window.location.pathname.split('/');
		let id = parts.pop() || parts.pop(); //MENOTE: remove trailing slash
		
		if(isNaN(id)) {
			
			//MENOTE: klarna url structure is different than woo
			let parsedQueryString = queryString.parse(location.search);
			if(parsedQueryString["sid"]) {
				id = parsedQueryString["sid"];
			}
			
			if(isNaN(id)) {
				return null;
			}
		}
		
		let orderUrl = Wprr.utils.wprrUrl.getGlobalItemUrl("orderCondition");
		orderUrl = Wprr.utils.url.addQueryString(orderUrl, "id", id);
		
		let invert = objectPath.get(this.getReference("blockData"), "invert");
		
		let checkType = "equal";
		if(invert) {
			checkType = "invert/" + checkType;
		}
		
		return <wrapper>
			<Wprr.DataLoader loadData={{"order": orderUrl}}>
				<Wprr.HasData check={Wprr.sourceProp("order", "purchaseType")} checkType={checkType} compareValue={Wprr.sourceReference("blockData", "purchaseType")}>
					<div>
						<Wprr.ContentsAndInjectedComponents content={Wprr.sourceReference("blockData", "innerMarkup")}/>
					</div>
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
				<div>{Wprr.translateText("Completed order condition")}</div>
				<hr className="line no-margin"/>
			</Wprr.FlexRow>
			<Wprr.FlexRow className="small-item-spacing">
				<Wprr.EditableProps editableProps="purchaseType" externalStorage={Wprr.sourceReference("wprr/wpBlockEditor/externalStorage")}>
					<Wprr.TermSelection valueName="purchaseType" taxonomy="dbm_relation" valueField="slug" subtree="purchase-type" noSelectionLabel={Wprr.sourceTranslation("Typ av köp")} />
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
					{Wprr.translateText("Slut:")}
					{" "}
					{Wprr.translateText("Completed order condition")}
				</div>
				<hr className="line no-margin"/>
			</Wprr.FlexRow>
		</div>;
	}
}
