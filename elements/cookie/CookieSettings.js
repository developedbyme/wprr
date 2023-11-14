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
		//console.log("saveSelection");
		
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
		
		this._performance.value = Cookies.get("cookie/allowPreferences") == 1;
		this._statistics.value = Cookies.get("cookie/allowStatistics") == 1;
		this._marketing.value = Cookies.get("cookie/allowMarketing") == 1;
		this._hideCookieBar.value = Cookies.get("cookie/hideCookieBar") == 1;
		this._consentDate.value = Cookies.get("cookie/consentTime");
		
	}
	
	_getLayout(aSlots) {
		
		return React.createElement("div", {
  className: "centered-content-text"
}, /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "small-item-spacing flex-no-wrap",
  itemClasses: "flex-no-resize,flex-resize"
}, /*#__PURE__*/React.createElement(Wprr.Checkbox, {
	id: "cookie-setting-strictly",
  checked: true,
  value: true,
  disabled: true
}), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
  className: "cookie-setting-label",
	"for": "cookie-setting-strictly"
}, Wprr.idText("Strictly necessary cookies", "site.cookieSettings.strictly.title")), /*#__PURE__*/React.createElement("div", {
  className: "cookie-setting-description-text"
}, Wprr.idText("These cookies are essential for you to browse the website and use its features, such as accessing secure areas of the site.", "site.cookieSettings.strictly.description")))), /*#__PURE__*/React.createElement("div", {
  className: "spacing standard"
}), /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "small-item-spacing flex-no-wrap",
  itemClasses: "flex-no-resize,flex-resize"
}, /*#__PURE__*/React.createElement(Wprr.Checkbox, {
  id: "cookie-setting-preference",
  checked: this._performance
}), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
  className: "cookie-setting-label",
	"for": "cookie-setting-preference"
}, Wprr.idText("Preferences cookies", "site.cookieSettings.preference.title")), /*#__PURE__*/React.createElement("div", {
  className: "cookie-setting-description-text"
}, Wprr.idText("These cookies allow a website to remember choices you have made in the past.", "site.cookieSettings.preference.description")))), /*#__PURE__*/React.createElement("div", {
  className: "spacing standard"
}), /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "small-item-spacing flex-no-wrap",
  itemClasses: "flex-no-resize,flex-resize"
}, /*#__PURE__*/React.createElement(Wprr.Checkbox, {
  id: "cookie-setting-statistics",
  checked: this._statistics
}), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
  className: "cookie-setting-label",
	"for": "cookie-setting-statistics"
}, Wprr.idText("Statistics cookies", "site.cookieSettings.statistics.title")), /*#__PURE__*/React.createElement("div", {
  className: "cookie-setting-description-text"
}, Wprr.idText("These cookies collect information about how you use a website, like which pages you visited and which links you clicked on. None of this information can be used to identify you. It is all aggregated and, therefore, anonymized. Their sole purpose is to improve website functions.", "site.cookieSettings.statistics.description")))), /*#__PURE__*/React.createElement("div", {
  className: "spacing standard"
}), /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "small-item-spacing flex-no-wrap",
  itemClasses: "flex-no-resize,flex-resize"
}, /*#__PURE__*/React.createElement(Wprr.Checkbox, {
	id: "cookie-setting-martketing",
  checked: this._marketing
}), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
  className: "cookie-setting-label",
	"for": "cookie-setting-martketing"
}, Wprr.idText("Marketing cookies", "site.cookieSettings.marketing.title")), /*#__PURE__*/React.createElement("div", {
  className: "cookie-setting-description-text"
}, Wprr.idText("These cookies track your online activity to help advertisers deliver more relevant advertising or to limit how many times you see an ad. These cookies can share that information with other organizations or advertisers.", "site.cookieSettings.marketing.description")))), /*#__PURE__*/React.createElement("div", {
  className: "spacing standard"
}), /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "small-item-spacing flex-no-wrap",
  itemClasses: "flex-no-resize,flex-resize"
}, /*#__PURE__*/React.createElement(Wprr.Checkbox, {
	id: "cookie-setting-cookiebar",
  checked: this._hideCookieBar
}), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
  className: "cookie-setting-label",
	"for": "cookie-setting-cookiebar"
}, Wprr.idText("Hide cookie information when websites load", "site.cookieSettings.hideCookieBar.title")), /*#__PURE__*/React.createElement("div", {
  className: "cookie-setting-description-text"
}, Wprr.idText("Hides the cookie information and links that is displayed every time the website is loaded.", "site.cookieSettings.hideCookieBar.description")))), /*#__PURE__*/React.createElement("div", {
  className: "spacing standard"
}), /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "justify-center"
}, /*#__PURE__*/React.createElement(Wprr.CommandButton, {
  commands: [Wprr.commands.callFunction(this, this.saveSelection), Wprr.commands.reload()]
}, /*#__PURE__*/React.createElement("div", {
  className: "standard-button allow-all-cookies-button standard-button-padding"
}, Wprr.idText("Save settings", "site.cookieSettings.saveSettings")))), /*#__PURE__*/React.createElement(Wprr.OpenCloseExpandableArea, {
  open: this._consentDate
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  className: "spacing small"
}), /*#__PURE__*/React.createElement("div", {
  className: "small-description text-align-center"
}, /*#__PURE__*/React.createElement(Wprr.TextWithReplacements, {
  text: Wprr.sourceTranslation("Settings saved at: {time}", "site.cookieSettings.savedAt"),
  replacements: {
    "{time}": this._consentDate
  },
  sourceUpdates: this._consentDate
})))));
	}
	
	static getWpAdminEditor() {
		//console.log("getWpAdminEditor");
		
		let dataSettings = {
			
		};
		
		return React.createElement(Wprr.layout.admin.WpBlockEditor, {dataSettings: dataSettings},
			React.createElement("div", null)
		);
	}
}
