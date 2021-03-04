import React from 'react';
import Wprr from "wprr";
import objectPath from 'object-path';

let cacheValue = (new Date()).valueOf();

//import GoogleOptimizeCondition from "./GoogleOptimizeCondition";
export default class GoogleOptimizeCondition extends Wprr.BaseObject {

	constructor(aProps) {
		super(aProps);
		
		this.state["show"] = false;
		
		this._timeout = -1;
		this._callback_optimizeDataBound = this._callback_optimizeData.bind(this);
		this._callback_timeoutBound = this._callback_timeout.bind(this);
	}
	
	_callback_timeout() {
		//console.log("GoogleOptimizeCondition::_callback_timeout");
		this._timeout = -1;
		this.setState({"show": true});
	}
	
	_callback_optimizeData(aVariant, aExperimentId) {
		//console.log("GoogleOptimizeCondition::_callback_optimizeData");
		
		if(this._timeout !== -1) {
			clearTimeout(this._timeout);
			this._timeout = -1;
		}
		
		let variant = objectPath.get(this.getReference("blockData"), "variant");
		
		if(variant == aVariant) {
			this.setState({"show": true});
		}
		else {
			this.setState({"show": false});
		}
	}
	
	_addToDataLayer() {
		//console.log("GoogleOptimizeCondition::_addToDataLayer");
		
		if(dataLayer) {
			dataLayer.push(arguments);
		}
	}
	
	componentDidMount() {
		//console.log("GoogleOptimizeCondition::componentDidMount");
		super.componentDidMount();
		
		let experimentId = objectPath.get(this.getReference("blockData"), "experimentId");
		
		let isDefault = objectPath.get(this.getReference("blockData"), "isDefault");
		if(isDefault) {
			let seconds = parseFloat(objectPath.get(this.getReference("blockData"), "defaultTimeout"));
			if(isNaN(seconds)) {
				console.error("Seconds is not a number", objectPath.get(this.getReference("blockData"), "defaultTimeout"), this);
				seconds = 4;
			}
			this._timeout = setTimeout(this._callback_timeoutBound, Math.round(seconds*1000));
		}
		
		this._addToDataLayer('event', 'optimize.callback', {
			name: experimentId,
			callback: this._callback_optimizeDataBound
		});
	}
	
	_renderMainElement() {
		//console.log("GoogleOptimizeCondition::_renderMainElement");
		
		return <wrapper>
			<Wprr.HasData check={this.state["show"]}>
				<Wprr.ContentsAndInjectedComponents content={Wprr.sourceReference("blockData", "innerMarkup")}/>
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
				<div>{Wprr.translateText("Google optimize condition")}</div>
				<hr className="line no-margin"/>
			</Wprr.FlexRow>
			<Wprr.FlexRow className="small-item-spacing" itemClasses="width-70,width-30">
				<div>
					<div>{Wprr.translateText("Experiment id")}</div>
					<Wprr.EditableProps editableProps="experimentId" externalStorage={Wprr.sourceReference("wprr/wpBlockEditor/externalStorage")}>
						<Wprr.FormField valueName="experimentId" className="full-width" />
					</Wprr.EditableProps>
				</div>
				<div>
					<div>{Wprr.translateText("Variant")}</div>
					<Wprr.EditableProps editableProps="variant" externalStorage={Wprr.sourceReference("wprr/wpBlockEditor/externalStorage")}>
						<Wprr.FormField valueName="variant" className="full-width" />
					</Wprr.EditableProps>
				</div>
			</Wprr.FlexRow>
			<div className="spacing small" />
			<div>
				<Wprr.EditableProps editableProps="isDefault" externalStorage={Wprr.sourceReference("wprr/wpBlockEditor/externalStorage")}>
					<Wprr.Checkbox valueName="isDefault" />
				</Wprr.EditableProps>
				<span>{Wprr.translateText("Show by default after ")}</span>
					<Wprr.EditableProps editableProps="defaultTimeout" externalStorage={Wprr.sourceReference("wprr/wpBlockEditor/externalStorage")}>
						<Wprr.FormField type="number" valueName="defaultTimeout" />
					</Wprr.EditableProps>
				<span>{Wprr.translateText(" seconds if experiment doesn't exist or is too slow to load.")}</span>
			</div>
			<wp.editor.InnerBlocks />
			<Wprr.FlexRow className="small-item-spacing vertically-center-items" itemClasses="flex-resize,flex-no-resize,flex-resize">
				<hr className="line no-margin"/>
				<div>
					{Wprr.translateText("Slut:")}
					{" "}
					{Wprr.translateText("Google optimize condition")}
				</div>
				<hr className="line no-margin"/>
			</Wprr.FlexRow>
		</div>;
	}
}
