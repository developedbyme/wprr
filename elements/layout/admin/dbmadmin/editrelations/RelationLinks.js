"use strict";

import React from "react";
import Wprr from "wprr/Wprr";

import RelationLinksGroup from "./RelationLinksGroup";

export default class RelationLinks extends Wprr.BaseObject {
	
	_construct() {
		super._construct();
		
		let id = this.getFirstInput(Wprr.sourceReference("item", "id"), Wprr.sourceQueryString("id"));
		
		this._elementTreeItem.requireValue("loaded", false);
		
		let loader = this._elementTreeItem.addNode("loader", new Wprr.utils.data.nodes.LoadDataRange());
		
		this._elementTreeItem.requireSingleLink("item").idSource.addChangeCommand(Wprr.commands.callFunction(this, this._itemLoaded))
		this._elementTreeItem.requireSingleLink("item").idSource.input(loader.item.requireSingleLink("singleItem").idSource);
		
		
		let detailsLoader = this._elementTreeItem.addNode("detailsLoader", new Wprr.utils.data.nodes.LoadAdditionalItems());
		detailsLoader.item.setValue("url", this.getWprrUrl("range/?select=idSelection,anyStatus&encode=postTitle&ids={ids}", "wprrData"));
		detailsLoader.item.getLinks("ids").input(this._elementTreeItem.getLinks("linkedItems"));
		this._elementTreeItem.getValueSource("loaded").input(detailsLoader.item.getValueSource("loaded"));
		
		let url = "range/?select=idSelection,anyStatus&encode=postTitle,objectTypes,relations&ids=" + id;
		loader.item.setValue("url", this.getWprrUrl(url, "wprrData"));
	}
	
	_createArrowAnimation() {
		let item = this._elementTreeItem.group.createInternalItem();
		
		item.requireValue("open", false);
		item.requireValue("style", {});
		
		let switchToValue = item.addNode("switchToValue", new Wprr.utils.data.nodes.logic.Switch());
		switchToValue.sources.get("input").input(item.getValueSource("open"));
		switchToValue.addCase(true, 1);
		switchToValue.addCase(false, 0);
		
		let animateValue = item.addNode("animateValue", new Wprr.utils.data.nodes.AnimateValue());
		animateValue.sources.get("input").input(switchToValue.sources.get("output"));
		
		let scaleValue = item.addNode("scaleValue", new Wprr.utils.data.nodes.logic.Ratio());
		scaleValue.ratio = 90;
		scaleValue.sources.get("input").input(animateValue.sources.get("output"));
		
		let transform = item.addNode("transform", new Wprr.utils.data.nodes.css.Transform());
		transform.setupRotation();
		transform.sources.get("amount").input(scaleValue.sources.get("output"));
		
		let createStyle = item.addNode("createStyle", new Wprr.utils.data.nodes.SetObjectProperties());
		createStyle.addPropertySource("transform", transform.sources.get("transform"));
		
		item.getValueSource("style").input(createStyle.sources.get("object"));
		
		return item;
	}
	
	_itemLoaded() {
		console.log("_itemLoaded");
		
		let item = this._elementTreeItem.getSingleLink("item");
		
		let linkedItems = new Array();
		
		{
			let relations = Wprr.objectPath(item, "incomingRelations.items");
			let direction = "from";
			
			let groupedRelations = Wprr.utils.array.groupArray(relations, "type.linkedItem.slug.value");
			
			let groupIds = new Array();
			
			let currentArray = groupedRelations;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentGroup = currentArray[i];
				let currentGroupItem = this._elementTreeItem.group.createInternalItem();
				
				currentGroupItem.setValue("name", currentGroup["key"]);
				currentGroupItem.setValue("open", false);
				
				let arrowAnimation = this._createArrowAnimation();
				currentGroupItem.addSingleLink("arrowAnimation", arrowAnimation.id);
				arrowAnimation.getValueSource("open").input(currentGroupItem.getValueSource("open"));
				
				let allObjectTypes = Wprr.utils.array.removeDuplicates(Wprr.utils.array.makeFlat(Wprr.utils.array.mapField(currentGroup["value"], direction + ".linkedItem.objectTypes.ids")));
				
				let objectTypeIds = new Array();
				
				let currentArray2 = allObjectTypes;
				let currentArray2Length = currentArray2.length;
				for(let j = 0; j < currentArray2Length; j++) {
					let currentObjectType = currentArray2[j];
					let relationsWithType = Wprr.utils.array.getItemsBy(direction + ".linkedItem.objectTypes.ids", currentObjectType, currentGroup["value"], "arrayContains");
					
					let currentObjectTypeGroupItem = this._elementTreeItem.group.createInternalItem();
					currentObjectTypeGroupItem.addSingleLink("type", currentObjectType);
					currentObjectTypeGroupItem.setValue("open", false);
					let arrowAnimation = this._createArrowAnimation();
					currentObjectTypeGroupItem.addSingleLink("arrowAnimation", arrowAnimation.id);
					arrowAnimation.getValueSource("open").input(currentObjectTypeGroupItem.getValueSource("open"));
					
					currentObjectTypeGroupItem.getLinks("relations").setItems(Wprr.utils.array.mapField(relationsWithType, "id"));
					
					objectTypeIds.push(currentObjectTypeGroupItem.id);
				}
				
				currentGroupItem.getLinks("relations").setItems(Wprr.utils.array.mapField(currentGroup["value"], "id"));
				currentGroupItem.getLinks("relationGroups").setItems(objectTypeIds);
				
				linkedItems = linkedItems.concat(Wprr.utils.array.mapField(currentGroup["value"], "from.id"));
				
				groupIds.push(currentGroupItem.id);
			}
			
			this._elementTreeItem.getLinks("incomingGroups").setItems(groupIds);
		}
		
		{
			let relations = Wprr.objectPath(item, "outgoingRelations.items");
			let direction = "to";
			
			let groupedRelations = Wprr.utils.array.groupArray(relations, "type.linkedItem.slug.value");
			
			let groupIds = new Array();
			
			let currentArray = groupedRelations;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentGroup = currentArray[i];
				let currentGroupItem = this._elementTreeItem.group.createInternalItem();
				
				currentGroupItem.setValue("name", currentGroup["key"]);
				currentGroupItem.setValue("open", false);
				
				let arrowAnimation = this._createArrowAnimation();
				currentGroupItem.addSingleLink("arrowAnimation", arrowAnimation.id);
				arrowAnimation.getValueSource("open").input(currentGroupItem.getValueSource("open"));
				
				let allObjectTypes = Wprr.utils.array.removeDuplicates(Wprr.utils.array.makeFlat(Wprr.utils.array.mapField(currentGroup["value"], direction + ".linkedItem.objectTypes.ids")));
				
				let objectTypeIds = new Array();
				
				let currentArray2 = allObjectTypes;
				let currentArray2Length = currentArray2.length;
				for(let j = 0; j < currentArray2Length; j++) {
					let currentObjectType = currentArray2[j];
					let relationsWithType = Wprr.utils.array.getItemsBy(direction + ".linkedItem.objectTypes.ids", currentObjectType, currentGroup["value"], "arrayContains");
					
					let currentObjectTypeGroupItem = this._elementTreeItem.group.createInternalItem();
					currentObjectTypeGroupItem.addSingleLink("type", currentObjectType);
					currentObjectTypeGroupItem.setValue("open", false);
					let arrowAnimation = this._createArrowAnimation();
					currentObjectTypeGroupItem.addSingleLink("arrowAnimation", arrowAnimation.id);
					arrowAnimation.getValueSource("open").input(currentObjectTypeGroupItem.getValueSource("open"));
					
					currentObjectTypeGroupItem.getLinks("relations").setItems(Wprr.utils.array.mapField(relationsWithType, "id"));
					
					objectTypeIds.push(currentObjectTypeGroupItem.id);
				}
				
				currentGroupItem.getLinks("relations").setItems(Wprr.utils.array.mapField(currentGroup["value"], "id"));
				currentGroupItem.getLinks("relationGroups").setItems(objectTypeIds);
				
				linkedItems = linkedItems.concat(Wprr.utils.array.mapField(currentGroup["value"], "to.id"));
				
				groupIds.push(currentGroupItem.id);
			}
			
			this._elementTreeItem.getLinks("outgoingGroups").setItems(groupIds);
		}
		
		this._elementTreeItem.getLinks("linkedItems").setItems(linkedItems);
		
		{
			let relations = Wprr.objectPath(item, "userRelations.items");
			
			let groupedRelations = Wprr.utils.array.groupArray(relations, "type.linkedItem.slug.value");
			
			let groupIds = new Array();
			
			let currentArray = groupedRelations;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentGroup = currentArray[i];
				let currentGroupItem = this._elementTreeItem.group.createInternalItem();
				
				currentGroupItem.setValue("name", currentGroup["key"]);
				currentGroupItem.getLinks("relations").setItems(Wprr.utils.array.mapField(currentGroup["value"], "id"));
				
				groupIds.push(currentGroupItem.id);
			}
			
			this._elementTreeItem.getLinks("userGroups").setItems(groupIds);
		}
		
	}
	
	_renderMainElement() {
		
		return React.createElement("div", {"className": "centered-site"},
			
			React.createElement(Wprr.HasData, {"check": this._elementTreeItem.requireSingleLink("item").idSource},
				React.createElement(Wprr.SelectItem, {"id": this._elementTreeItem.requireSingleLink("item").idSource},
					React.createElement("div", null, 
						React.createElement("div", null, 
							Wprr.text(Wprr.sourceReference("item", "title")),
							React.createElement("div", {"className": "spacing small"}),
							React.createElement(Wprr.layout.ItemList, {"ids": Wprr.sourceReference("item", "objectTypes.idsSource")},
								React.createElement("div", {"className": "standard-flag standard-flag-padding small-text"}, 
									Wprr.text(Wprr.sourceReference("item", "slug"))
						
								),
								React.createElement(Wprr.FlexRow, {"data-slot": "insertElements", "className": "small-item-spacing"})
							)
						),
						React.createElement("div", {"className": "spacing standard"}),
						React.createElement(Wprr.HasData, {"check": this._elementTreeItem.getValueSource("loaded")},
							React.createElement("div", null,
								React.createElement(Wprr.FlexRow, {"className": "halfs small-item-spacing flex-no-wrap"},
									React.createElement("div", null, 
										React.createElement("div", null, "Incoming"),
										React.createElement(Wprr.layout.ItemList, {"ids": this._elementTreeItem.getLinks("incomingGroups").idsSource, "as": "group"},
											React.createElement("div", null,
												React.createElement(RelationLinksGroup, {"direction": "from"})
											)
										)
									),
									React.createElement("div", null, 
										React.createElement("div", null, "Outgoing"),
										React.createElement(Wprr.layout.ItemList, {"ids": this._elementTreeItem.getLinks("outgoingGroups").idsSource, "as": "group"},
											React.createElement("div", null,
												React.createElement(RelationLinksGroup, {"direction": "to"})
											)
										)
									)
								)
							),
							React.createElement("div", null, 
								React.createElement("div", null, "User"),
								React.createElement(Wprr.layout.ItemList, {"ids": this._elementTreeItem.getLinks("userGroups").idsSource, "as": "group"},
									React.createElement("div", null,
										React.createElement(RelationLinksGroup, {"direction": "user"})
									)
								)
							)
						)
					)
				)
			)
		);
	}
	
	static getWpAdminEditor() {
		//console.log("getWpAdminEditor");
		
		let dataSettings = {
			
		};
		
		return React.createElement(Wprr.layout.admin.WpBlockEditor, {dataSettings: dataSettings});
	}
}