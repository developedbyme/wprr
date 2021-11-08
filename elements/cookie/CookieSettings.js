import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

import Cookies from "js-cookie";
import moment from "moment";

export default class CookieSettings extends Layout {
	
	constructor(aProps) {
		super(aProps);
		
		this._layoutName = "cookieSettings";
		
		this._performance = Wprr.sourceValue(false);
		this._statistics = Wprr.sourceValue(false);
		this._marketing = Wprr.sourceValue(false);
		this._hideCookieBar = Wprr.sourceValue(false);
		this._consentDate = Wprr.sourceValue(null);
	}
	
	saveSelection() {
		console.log("saveSelection");
		
		let expires = this.getFirstInput("expires", 365);
		
		Cookies.set("cookie/hideCookieBar", this._hideCookieBar.value ? 1 : 0, {"expires": expires});
		
		Cookies.set("cookie/allowPreferences", this._performance.value ? 1 : 0, {"expires": expires});
		Cookies.set("cookie/allowStatistics", this._statistics.value ? 1 : 0, {"expires": expires});
		Cookies.set("cookie/allowMarketing", this._marketing.value ? 1 : 0, {"expires": expires});
		
		let consentTime = moment().format("Y-MM-DD[T]HH:mm:ssZ");
		
		Cookies.set("cookie/consentTime", consentTime, {"expires": expires});
		this._consentDate.value = consentTime;
		
		let trackingController = this.getFirstInput(Wprr.sourceReference("wprr/project", "items.project.tracking.linkedItem.trackingController"));
		if(trackingController) {
			trackingController.setupAllowedTracking(this._statistics.value, this._marketing.value);
			trackingController.start();
		}
	}
	
	_prepareInitialRender() {
		super._prepareInitialRender();
		
		this._performance.value = Cookies.getJSON("cookie/allowPreferences") == 1;
		this._statistics.value = Cookies.getJSON("cookie/allowStatistics") == 1;
		this._marketing.value = Cookies.getJSON("cookie/allowMarketing") == 1;
		this._hideCookieBar.value = Cookies.getJSON("cookie/hideCookieBar") == 1;
		this._consentDate.value = Cookies.getJSON("cookie/consentTime");
		
	}
	
	_getLayout(aSlots) {
		
		return <div className="centered-content-text">
			<Wprr.FlexRow className="small-item-spacing flex-no-wrap" itemClasses="flex-no-resize,flex-resize">
				<Wprr.Checkbox checked={true} value={true} disabled={true} />
				<div>
					<div className="cookie-setting-label">{Wprr.idText("Strictly necessary cookies", "site.cookieSettings.strictly.title")}</div>
					<div className="cookie-setting-description-text">{Wprr.idText("These cookies are essential for you to browse the website and use its features, such as accessing secure areas of the site.", "site.cookieSettings.strictly.description")}</div>
				</div>
			</Wprr.FlexRow>
			<div className="spacing standard" />
			<Wprr.FlexRow className="small-item-spacing flex-no-wrap" itemClasses="flex-no-resize,flex-resize">
				<Wprr.Checkbox checked={this._performance} />
				<div>
					<div className="cookie-setting-label">{Wprr.idText("Preferences cookies", "site.cookieSettings.preference.title")}</div>
					<div className="cookie-setting-description-text">{Wprr.idText("These cookies allow a website to remember choices you have made in the past.", "site.cookieSettings.preference.description")}</div>
				</div>
			</Wprr.FlexRow>
			<div className="spacing standard" />
			<Wprr.FlexRow className="small-item-spacing flex-no-wrap" itemClasses="flex-no-resize,flex-resize">
				<Wprr.Checkbox checked={this._statistics} />
				<div>
					<div className="cookie-setting-label">{Wprr.idText("Statistics cookies", "site.cookieSettings.statistics.title")}</div>
					<div className="cookie-setting-description-text">{Wprr.idText("These cookies collect information about how you use a website, like which pages you visited and which links you clicked on. None of this information can be used to identify you. It is all aggregated and, therefore, anonymized. Their sole purpose is to improve website functions.", "site.cookieSettings.statistics.description")}</div>
				</div>
			</Wprr.FlexRow>
			<div className="spacing standard" />
			<Wprr.FlexRow className="small-item-spacing flex-no-wrap" itemClasses="flex-no-resize,flex-resize">
				<Wprr.Checkbox checked={this._marketing} />
				<div>
					<div className="cookie-setting-label">{Wprr.idText("Marketing cookies", "site.cookieSettings.marketing.title")}</div>
					<div className="cookie-setting-description-text">{Wprr.idText("These cookies track your online activity to help advertisers deliver more relevant advertising or to limit how many times you see an ad. These cookies can share that information with other organizations or advertisers.", "site.cookieSettings.marketing.description")}</div>
				</div>
			</Wprr.FlexRow>
			<div className="spacing standard" />
			<Wprr.FlexRow className="small-item-spacing flex-no-wrap" itemClasses="flex-no-resize,flex-resize">
				<Wprr.Checkbox checked={this._hideCookieBar} />
				<div>
					<div className="cookie-setting-label">{Wprr.idText("Hide cookie information when websites load", "site.cookieSettings.hideCookieBar.title")}</div>
					<div className="cookie-setting-description-text">{Wprr.idText("Hides the cookie information and links that is displayed every time the website is loaded.", "site.cookieSettings.hideCookieBar.description")}</div>
				</div>
			</Wprr.FlexRow>
			<div className="spacing standard" />
			<Wprr.FlexRow className="justify-center">
				<Wprr.CommandButton commands={[
					Wprr.commands.callFunction(this, this.saveSelection),
					Wprr.commands.reload()
				]}>
					<div className="standard-button allow-all-cookies-button standard-button-padding">
						{Wprr.idText("Save settings", "site.cookieSettings.saveSettings")}
					</div>
				</Wprr.CommandButton>
			</Wprr.FlexRow>
			<Wprr.OpenCloseExpandableArea open={this._consentDate}>
				<div>
					<div className="spacing small" />
					<div className="small-description text-align-center">
						<Wprr.TextWithReplacements
							text={Wprr.sourceTranslation("Settings saved at: {time}", "site.cookieSettings.savedAt")}
							replacements={{
								"{time}": this._consentDate
							}}
							sourceUpdates={this._consentDate}
						/>
					</div>
				</div>
			</Wprr.OpenCloseExpandableArea>
		</div>;
	}
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		let dataSettings = {
			
		};
		
		return React.createElement(Wprr.layout.admin.WpBlockEditor, {dataSettings: dataSettings},
			React.createElement("div", null)
		);
	}
}
