import React from 'react';
import Wprr from "wprr";
import objectPath from 'object-path';
import moment from "moment";

let cacheValue = (new Date()).valueOf();

//import TimedContent from "./TimedContent";
export default class TimedContent extends Wprr.BaseObject {

	constructor(aProps) {
		super(aProps);
		
		this._hasAccess = Wprr.sourceValue(false);
		this._checkInterval = -1;
		
		this._checkForAccessBound = this._checkForAccess.bind(this);
	}
	
	_checkForAccess() {
		//console.log("_checkForAccess");
		
		let access = this.getFirstInput(Wprr.sourceReference("access"));
		let invert = this.getFirstInput(Wprr.sourceReference("blockData", "invert"));
		
		let hasAccess = false;
		let currentTime = moment().unix();
		
		let currentArray = access["access"];
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentAccess = currentArray[i];
			if((currentAccess["startAt"] === -1 || currentAccess["startAt"] <= currentTime) && (currentAccess["endAt"] === -1 || currentAccess["endAt"] > currentTime)) {
				hasAccess = currentAccess["allow"];
				break;
			}
		}
		
		if(invert) {
			hasAccess = !hasAccess;
		}
		
		if(this._hasAccess.value !== hasAccess) {
			this._hasAccess.value = hasAccess;
			
			if (document.exitFullscreen) {
			    document.exitFullscreen();
			  } else if (document.webkitExitFullscreen) { /* Safari */
			    document.webkitExitFullscreen();
			  } else if (document.msExitFullscreen) { /* IE11 */
			    document.msExitFullscreen();
			}
		}
	}
	
	_prepareInitialRender() {
		super._prepareInitialRender();
		
		this._checkForAccess();
		this._checkInterval = setInterval(this._checkForAccessBound, 1*1000);
	}
	
	_renderMainElement() {
		//console.log("TimedContent::_renderMainElement");
		
		return <div>
			<Wprr.HasData check={this._hasAccess}>
				<div>
					<Wprr.ContentsAndInjectedComponents content={Wprr.sourceReference("blockData", "innerMarkup")} parsedContent={Wprr.sourceReference("blockData", "parsedContent")} />
				</div>
			</Wprr.HasData>
		</div>
	}
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		let dataSettings = {
			"access": {
				"value": "wprr/v1/range-item/dbm_data/idSelection/default,timedAccess?ids={id}",
				"replacements": {
					"{id}": {
						"type": "reference",
						"path": "blockData",
						"deepPath": "timedContent"
					}
				}
			}
		};
		
		return <Wprr.layout.admin.WpBlockEditor dataSettings={dataSettings}>
			<Wprr.layout.form.LabelledArea label="Timed access">
				<Wprr.RangeSelection range="wprr/v1/range/dbm_data/relation/default?type=timed-access">
					<Wprr.Selection value={Wprr.sourceReference("wprr/wpBlockEditor/externalStorage", "timedContent")} />
				</Wprr.RangeSelection>
			</Wprr.layout.form.LabelledArea>
				<div>
					<Wprr.EditableProps editableProps="invert" externalStorage={Wprr.sourceReference("wprr/wpBlockEditor/externalStorage")}>
						<Wprr.Checkbox className="full-width" valueName="invert" />
					</Wprr.EditableProps>
					<label>{Wprr.translateText("Invertera matchning")}</label>
				</div>
			<hr className="line no-margin"/>
			<wp.editor.InnerBlocks />
			<Wprr.FlexRow className="small-item-spacing vertically-center-items" itemClasses="flex-resize,flex-no-resize,flex-resize">
				<hr className="line no-margin"/>
				<div>
					{Wprr.translateText("End:")}
					{" "}
					{Wprr.translateText("Timed content")}
				</div>
				<hr className="line no-margin"/>
			</Wprr.FlexRow>
		</Wprr.layout.admin.WpBlockEditor>
	}
}
