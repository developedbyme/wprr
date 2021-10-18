import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

import Cookies from "js-cookie";
import moment from "moment";

export default class CookieBar extends Layout {
	
	constructor(aProps) {
		super(aProps);
		
		this._layoutName = "cookieBar";
		
		this._open = Wprr.sourceValue(false);
	}
	
	allowAll() {
		console.log("allowAll");
		
		let expires = this.getFirstInput("expires", 365);
		
		Cookies.set("cookie/hideCookieBar", 1, {"expires": expires});
		
		Cookies.set("cookie/allowPreferences", 1, {"expires": expires});
		Cookies.set("cookie/allowStatistics", 1, {"expires": expires});
		Cookies.set("cookie/allowMarketing", 1, {"expires": expires});
		Cookies.set("cookie/consentTime", moment().format("Y-MM-DD[T]HH:mm:ssZ"), {"expires": expires});
		
		//METODO: send message to analytics
		
		this._open.value = false;
	}
	
	_prepareInitialRender() {
		super._prepareInitialRender();
		
		let showBar = !Cookies.getJSON("cookie/hideCookieBar");
		
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
		
		let textElement = <div>
			<div className="cookie-bar-title">{Wprr.idText("Your privacy is important to us", "site.cookieBar.title")}</div>
			<div className="cookie-bar-content">{Wprr.idText("We use cookies to improve your experience on our site.", "site.cookieBar.content")}</div>
		</div>;
		
		let mobileLayout = <div className="centered-site">
			{textElement}
			<div className="spacing small" />
			<Wprr.FlexRow className="small-item-spacing vertically-center-items justify-between">
				<Wprr.Link href={Wprr.sourceReference("projectLinks", "global-pages/cookie-settings")} className="custom-styled-link">
					<div className="secondary-button cookie-settings-button secondary-button-padding">
						{Wprr.idText("Settings", "site.cookieBar.settings")}
					</div>
				</Wprr.Link>
				<Wprr.CommandButton commands={Wprr.commands.callFunction(this, this.allowAll)}>
					<div className="standard-button allow-all-cookies-button standard-button-padding">
						{Wprr.idText("I agree", "site.cookieBar.allowAllShort")}
					</div>
				</Wprr.CommandButton>
			</Wprr.FlexRow>
		</div>;
		
		let desktopLayout = <div className="centered-site">
			<Wprr.FlexRow className="justify-between flex-no-wrap" itemClasses="flex-resize,flex-no-resize">
				{textElement}
				<div>
					<Wprr.FlexRow className="small-item-spacing vertically-center-items">
						<Wprr.Link href={Wprr.sourceReference("projectLinks", "global-pages/cookie-settings")} className="custom-styled-link">
							<div className="secondary-button cookie-settings-button secondary-button-padding">
								{Wprr.idText("Settings", "site.cookieBar.settings")}
							</div>
						</Wprr.Link>
						<Wprr.CommandButton commands={Wprr.commands.callFunction(this, this.allowAll)}>
							<div className="standard-button allow-all-cookies-button standard-button-padding">
								{Wprr.idText("I'm ok with that", "site.cookieBar.allowAll")}
							</div>
						</Wprr.CommandButton>
					</Wprr.FlexRow>
				</div>
			</Wprr.FlexRow>
		</div>;
		
		let responsiveLayout = Wprr.creators.responsiveTemplate(mobileLayout);
		responsiveLayout.addResponsiveTemplate(desktopLayout, 640);
		
		return React.createElement("div", {className: "cookie-bar-position"},
			<Wprr.OpenCloseExpandableArea open={this._open}>
				<div className="cookie-bar cookie-bar-padding">
					{responsiveLayout.getReactElements()}
				</div>
			</Wprr.OpenCloseExpandableArea>
		);
	}
}
