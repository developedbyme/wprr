import React from "react";
import Wprr from "wprr/Wprr";
import Dbm from "dbm";

import Layout from "wprr/elements/layout/Layout";

import Cookies from "js-cookie";
import moment from "moment";

export default class CookieBar extends Layout {
	
	constructor(aProps) {
		super(aProps);
		
		this._layoutName = "cookieBar";
		
		this._open = Wprr.sourceValue(false);
	}

	_getDomain() {
		let parts = document.location.hostname.split('.');

        let length = parts.length;
        if (length === 1) {
            return parts[0];
        }
        else if(parts[length-2] === "co" && parts[length-1] === "uk") {
            return '.' + parts.slice(-3).join('.');
        }
        
        return '.' + parts.slice(-2).join('.');
	}

	_removeOldCookies() {
		Cookies.remove("cookie/hideCookieBar");
		Cookies.remove("cookie/allowPreferences");
		Cookies.remove("cookie/allowStatistics");
		Cookies.remove("cookie/allowMarketing");
		Cookies.remove("cookie/consentTime");
	}
	
	allowAll() {
		//console.log("allowAll");
		
		let expires = this.getFirstInput("expires", 365);

		this._removeOldCookies();

		let options = {"expires": expires, "domain": this._getDomain()};
		
		Cookies.set("cookie/hideCookieBar", 1, options);
		
		Cookies.set("cookie/allowPreferences", 1, options);
		Cookies.set("cookie/allowStatistics", 1, options);
		Cookies.set("cookie/allowMarketing", 1, options);
		Cookies.set("cookie/consentTime", moment().format("Y-MM-DD[T]HH:mm:ssZ"), options);
		
		this._open.value = false;
		
		let trackingController = this.getFirstInput(Wprr.sourceReference("wprr/project", "items.project.tracking.linkedItem.trackingController"));
		if(trackingController) {
			trackingController.setupAllowedTracking(true, true);
			trackingController.start();
		}
		
		Dbm.getInstance().repository.getItem("trackingController").allowStatistics = true;
		Dbm.getInstance().repository.getItem("trackingController").allowMarketing = true;
	}
	
	_prepareInitialRender() {
		super._prepareInitialRender();
		
		let showBar = !(Cookies.get("cookie/hideCookieBar") == 1);
		
		let forceShowCookieBar = this.getFirstInput(Wprr.sourceQueryString("forceShowCookieBar")) == "1";
		if(forceShowCookieBar) {
			showBar = forceShowCookieBar;
		}
		
		if(showBar) {
			this._open.setWithDelay(true, 1);
		}
	}
	
	_getLayout(aSlots) {
		
		let project = this.getFirstInput(Wprr.sourceReference("wprr/project"));
		
		let textElement = React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  className: "cookie-bar-title"
}, Wprr.idText("Your privacy is important to us", "site.cookieBar.title")), /*#__PURE__*/React.createElement("div", {
  className: "spacing micro"
}), /*#__PURE__*/React.createElement("div", {
  className: "cookie-bar-content"
}, Wprr.idText("We use cookies to improve your experience on our site.", "site.cookieBar.content")));
		
let mobileLayout = React.createElement("div", {
  className: "centered-site"
}, textElement, /*#__PURE__*/React.createElement("div", {
  className: "spacing small"
}), /*#__PURE__*/React.createElement(Wprr.CommandButton, {
  commands: Wprr.commands.callFunction(this, this.allowAll)
}, /*#__PURE__*/React.createElement("div", {
  className: "standard-button allow-all-cookies-button standard-button-padding text-align-center"
}, Wprr.idText("I agree", "site.cookieBar.allowAllShort"))), /*#__PURE__*/React.createElement("div", {
  className: "spacing micro"
}), /*#__PURE__*/React.createElement(Wprr.Link, {
  href: Wprr.sourceReference("projectLinks", "global-pages/cookie-settings"),
  className: "custom-styled-link"
}, /*#__PURE__*/React.createElement("div", {
  className: "secondary-button cookie-settings-button secondary-button-padding text-align-center"
}, Wprr.idText("Settings", "site.cookieBar.settings"))));
		
		let desktopLayout = React.createElement("div", {
  className: "centered-site"
}, /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "justify-between flex-no-wrap",
  itemClasses: "flex-resize,flex-no-resize"
}, textElement, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wprr.FlexRow, {
  className: "small-item-spacing vertically-center-items"
}, /*#__PURE__*/React.createElement(Wprr.Link, {
  href: Wprr.sourceReference("projectLinks", "global-pages/cookie-settings"),
  className: "custom-styled-link"
}, /*#__PURE__*/React.createElement("div", {
  className: "secondary-button cookie-settings-button secondary-button-padding"
}, Wprr.idText("Settings", "site.cookieBar.settings"))), /*#__PURE__*/React.createElement(Wprr.CommandButton, {
  commands: Wprr.commands.callFunction(this, this.allowAll)
}, /*#__PURE__*/React.createElement("div", {
  className: "standard-button allow-all-cookies-button standard-button-padding"
}, Wprr.idText("I'm ok with that", "site.cookieBar.allowAll")))))));
		
		let responsiveLayout = Wprr.creators.responsiveTemplate(mobileLayout);
		responsiveLayout.addResponsiveTemplate(desktopLayout, 640);
		
		return React.createElement("div", {className: "cookie-bar-position"},
			React.createElement(Wprr.OpenCloseExpandableArea, {
			  open: this._open
			}, /*#__PURE__*/React.createElement("div", {
			  className: "cookie-bar cookie-bar-padding"
			}, responsiveLayout.getReactElements()))
		);
	}
}
