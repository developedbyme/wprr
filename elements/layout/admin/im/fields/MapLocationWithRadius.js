import Wprr from "wprr";
import React from "react";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class MapLocationWithRadius extends WprrBaseObject {
	
	constructor(aProps) {
		super(aProps);
		
		this._map = null;
		this._radiusCircle = null;
		this._marker = null;
		this._mapLoaded = Wprr.sourceValue(false);
		
		this._longitude = Wprr.sourceValue(null);
		this._latitude = Wprr.sourceValue(null);
		this._radius = Wprr.sourceValue(null);
		this._radius.addChangeCommand(Wprr.commands.callFunction(this, this._radiusUpdated));
		
		this._callback_mapClickedBound = this._callback_mapClicked.bind(this);
	}
	
	_mapScriptLoaded() {
		this._mapLoaded.value = true;
	}
	
	getMap() {
		return this._map;
	}
	
	_getCenterForMap() {
		let position = {"lat": 61.5376836, "lng": 13.9408607}; //MENOTE: Sweden
		
		if(this._latitude.value !== null) {
			position["lat"] = this._latitude.value;
			position["lng"] = this._longitude.value;
		}
		
		return position;
	}
	
	_createMap(aElement) {
		
		aElement.classList.add("full-size");
		
		this._map = new google.maps.Map(aElement, {zoom: 4, center: this._getCenterForMap()});
		this._map.addListener("click", this._callback_mapClickedBound);
		
		let defaultPosition = new google.maps.LatLng(0, 0);
		this._marker = new google.maps.Marker({"position": defaultPosition});
		
		this._radiusCircle = new google.maps.Circle({
			strokeColor: "#FF0000",
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: "#FF0000",
			fillOpacity: 0.35,
			center: defaultPosition,
			radius: 0,
		});
		
		this._updateMarkerPosition();
	}
	
	_callback_mapClicked(aEvent) {
		console.log("_callback_mapClicked");
		console.log(aEvent);
		
		let longitude = aEvent.latLng.lng();
		let latitude = aEvent.latLng.lat();
		
		this._latitude.value = latitude;
		this._longitude.value = longitude;
		
		let editor = this.getFirstInput(Wprr.sourceReference("field/externalStorage"));
		let value = editor.getValue("value");
		if(!value) {
			value = {};
		}
		value = Wprr.utils.object.copyViaJson(value);
		value["lat"] = latitude;
		value["lng"] = longitude;
		editor.updateValue("value", value);
		
		this._updateMarkerPosition();
	}
	
	_updateMap(aElement) {
		this._updateRadius();
		this._updateMarkerPosition();
	}
	
	_updateRadius() {
		console.log("_updateRadius");
		
		if(this._radiusCircle) {
			if(this._map && this._latitude.value !== null && this._radius.value !== null) {
				let markerLocation = new google.maps.LatLng(this._latitude.value, this._longitude.value);
				
				this._radiusCircle.setRadius(1*this._radius.value);
				this._radiusCircle.setMap(this._map);
				this._radiusCircle.setCenter(markerLocation);
			}
			else {
				this._radiusCircle.setMap(null);
			}
		}
	}
	
	_updateMarkerPosition() {
		console.log("_updateMarkerPosition");
		
		if(this._marker) {
			if(this._map && this._latitude.value !== null) {
		
				let markerLocation = new google.maps.LatLng(this._latitude.value, this._longitude.value);
			
				this._marker.setMap(this._map);
				this._marker.setPosition(markerLocation);
			}
			else {
				this._marker.setMap(null);
			}
		}
	}
	
	_radiusUpdated() {
		let currentValue = 1*this._radius.value;
		if(!isNaN(currentValue)) {
			let editor = this.getFirstInput(Wprr.sourceReference("field/externalStorage"));
			let value = editor.getValue("value");
			if(!value) {
				value = {};
			}
			value = Wprr.utils.object.copyViaJson(value);
			if(currentValue !== value["radius"]) {
				value["radius"] = currentValue;
				editor.updateValue("value", value);
			}
		}
	}
	
	_prepareInitialRender() {
		super._prepareInitialRender();
		
		let apiKey = this.getFirstInput("apiKey", Wprr.sourceReference("googleMaps/apiKey"));
		
		wprr.loadScript("https://maps.googleapis.com/maps/api/js?key=" + apiKey + "&libraries=places,geometry", Wprr.commands.callFunction(this, this._mapScriptLoaded));
		
	}
	
	_prepareRender() {
		super._prepareRender();
		
		let editor = this.getFirstInput(Wprr.sourceReference("field/externalStorage"));
		let value = editor.getValue("value");
		if(value) {
			if(value["lat"]) {
				this._latitude.value = value["lat"];
			}
			if(value["lng"]) {
				this._longitude.value = value["lng"];
			}
			if(value["radius"]) {
				this._radius.value = value["radius"];
			}
		}
		else {
			this._latitude.value = null;
			this._longitude.value = null;
			this._radius.value = null;
		}
		
		this._updateRadius();
		this._updateMarkerPosition();
	}
	
	_renderMainElement() {
		
		return React.createElement(Wprr.EditableProps, {editableProps: "value", externalStorage: Wprr.sourceReference("field/externalStorage")},
			React.createElement("div", {"className": "standard-box table-map-height"},
				React.createElement(Wprr.HasData, {"check": this._mapLoaded}, 
					React.createElement(Wprr.NativeElementArea, {
						setupCommands: Wprr.commands.callFunction(this, this._createMap, [Wprr.source("event", "raw")]),
						renderCommands: Wprr.commands.callFunction(this, this._updateMap, [Wprr.source("event", "raw")]),
						className: "full-size",
						sourceUpdates: [this._longitude, this._latitude, this._radius]
					})
				)
			),
			React.createElement(Wprr.layout.form.LabelledArea, {"label": Wprr.sourceTranslation("Radius (m)", "site.radiusInMeters")},
				React.createElement(Wprr.FormField, {"value": this._radius, "className": "standard-field standard-field-padding full-width"})
			)
		);
	}
}