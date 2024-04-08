import React from "react";
import Wprr from "wprr/Wprr";

export default class EditLoadedDataSources extends Wprr.BaseObject {
	
	_construct() {
		super._construct();
		
		this._elementTreeItem.addSingleLink("operation", null);
		this._elementTreeItem.getLinks("selectedItems");
		
		let loader = this._elementTreeItem.createNode("loader", "loadDataRange");
		
		let detailsLoader = this._elementTreeItem.addNode("detailsLoader", new Wprr.utils.data.nodes.LoadAdditionalItems());
		detailsLoader.item.setValue("url", this.getWprrUrl("range/?select=idSelection,anyStatus&encode=fields,postStatus&ids={ids}", "wprrData"));
		detailsLoader.item.getLinks("ids").input(loader.item.getLinks("items"));
		
		this._elementTreeItem.getValueSource("loaded").input(detailsLoader.item.getValueSource("loaded"));
		
		let activeList = this._elementTreeItem.addNode("activeList", new Wprr.utils.data.multitypeitems.controllers.list.ActiveList());
		activeList.item.setValue("activateWhenAdded", false);
		activeList.item.getLinks("items").input(this._elementTreeItem.getLinks("items"));
		
		this._elementTreeItem.getLinks("rows").input(activeList.item.getLinks("rows"));
		this._elementTreeItem.getLinks("selectedItems").input(activeList.item.getLinks("activeItems"));
		
		let filterItem = this._elementTreeItem.group.createInternalItem();
		let filteredList = Wprr.utils.data.multitypeitems.controllers.list.FilteredList.create(filterItem);
		filterItem.getType("all").input(this._elementTreeItem.getType("rows"));
		
		let searchFilterItem = filteredList.addFieldSearch("forItem.linkedItem.searchIndex.value,forItem.linkedItem.fields.name.value.value.firstName,forItem.linkedItem.fields.name.value.value.lastName,forItem.linkedItem.fields.email.value.value");
		this._elementTreeItem.addSingleLink("searchFilter", searchFilterItem.id);
		
		let sort = Wprr.utils.data.multitypeitems.controllers.list.SortedList.create(this._elementTreeItem.group.createInternalItem());
		{
			//let sortPartItem = sort.addFieldSort("forItem.linkedItem.fields.{fieldName}.value.value");
		}
		
		sort.item.getType("all").input(filterItem.getType("filtered"));
		
		
		let pagination = this._elementTreeItem.addNode("pagination", new Wprr.utils.data.nodes.Pagination());
		let paginationRange = this._elementTreeItem.addNode("paginationRange", new Wprr.utils.data.nodes.CreateRange());
		let partOfArray = this._elementTreeItem.addNode("partOfArray", new Wprr.utils.data.nodes.PartOfArray());
		
		pagination.pageSize = 100;
		pagination.connectArrayToSize(sort.item.getType("sorted"));
		paginationRange.includeEndValue = false;
		paginationRange.sources.get("endAt").input(pagination.sources.get("numberOfPages"));
		
		partOfArray.sources.get("array").input(sort.item.getType("sorted"));
		partOfArray.sources.get("numberOfItems").input(pagination.sources.get("pageSize"));
		partOfArray.sources.get("startAt").input(pagination.sources.get("startAt"));
		
		this._elementTreeItem.getLinks("filteredItems").input(partOfArray.sources.get("partOfArray"));
		
		let copyValue = this._elementTreeItem.addNode("copyValue", new Wprr.utils.data.nodes.CopyValue());
		copyValue.sources.get("active").input(this._elementTreeItem.getValueSource("loaded"));
		copyValue.sources.get("input").input(detailsLoader.item.getLinks("loadedIds"));
		
		this._elementTreeItem.getLinks("items").idsSource.input(copyValue.sources.get("output"));
		loader.setUrl(this.getWprrUrl("range/?select=byObjectType,includePrivate,includeDraft&encode=id&type=settings/data-source/loaded-data-source", "wprrData"));
		
		let table = this._elementTreeItem.addNode("table", new Wprr.utils.data.multitypeitems.itemstable.ItemsTable());
		
		{
			let column = table.createColumn("select", "Select/Id").setCellClasses("select-id-cell-width");
			column.setElement(<div>
				<Wprr.FlexRow className="micro-item-spacing vertically-center-items">
					<Wprr.Checkbox checked={Wprr.sourceReference("row", "active")} />
					<div className="standard-flag standard-flag-padding id-flag">{Wprr.text(Wprr.sourceReference("item", "id"))}</div>
				</Wprr.FlexRow>
				<Wprr.AddReference data={Wprr.sourceReference("itemEditor", "postStatusEditor")} as="valueEditor">
					<div className="spacing micro" />
					<Wprr.HasData check={Wprr.sourceReference("valueEditor", "valueSource")} checkType="equal" compareValue="draft">
						<Wprr.FlexRow>
							<div className="standard-flag standard-flag-padding status-flag draft">{Wprr.idText("Draft", "site.admin.draft")}</div>
						</Wprr.FlexRow>
					</Wprr.HasData>
				</Wprr.AddReference>
			</div>);
			column.setHeaderElement(<div />);
		}
		
		{
			let column = table.createColumn("name", "Name");
			column.setElement(React.createElement(Wprr.AddReference, {data: Wprr.sourceFunction(Wprr.sourceReference("itemEditor"), "getFieldEditor", ["name"]), as: "valueEditor"},
				React.createElement(Wprr.FormField, {className: "standard-field standard-field-padding full-width", value: Wprr.sourceReference("valueEditor", "valueSource")}),
				React.createElement(Wprr.layout.admin.editorsgroup.SaveValueChanges, null)
			));
			
		}
		
		{
			let column = table.createColumn("dataName", "Data name");
			column.setElement(React.createElement(Wprr.AddReference, {data: Wprr.sourceFunction(Wprr.sourceReference("itemEditor"), "getFieldEditor", ["dataName"]), as: "valueEditor"},
				React.createElement(Wprr.FormField, {className: "standard-field standard-field-padding full-width", value: Wprr.sourceReference("valueEditor", "valueSource")}),
				React.createElement(Wprr.layout.admin.editorsgroup.SaveValueChanges, null)
			));
		}
		
		{
			let column = table.createColumn("data", "Data");
			column.setElement(React.createElement(Wprr.AddReference, {data: Wprr.sourceFunction(Wprr.sourceReference("itemEditor"), "getFieldEditor", ["data"]), as: "valueEditor"},
				React.createElement(Wprr.JsonEditor, {className: "standard-field standard-field-padding full-width", value: Wprr.sourceReference("valueEditor", "valueSource")}),
				React.createElement(Wprr.layout.admin.editorsgroup.SaveValueChanges, null)
			));
		}
	}
	
	_create() {
		let creator = Wprr.utils.data.multitypeitems.controllers.admin.ItemCreator.create(this._elementTreeItem.group.createInternalItem());
		
		creator.setTitle("New data source");
		
		let objectType = this.getFirstInputWithDefault("objectType", "type");
		creator.setDataType("settings/data-source/loaded-data-source");
		
		creator.addType("settings/data-source");
		creator.addType("settings");
		creator.addType("named-item");
		
		let postStatus = "publish";
		creator.changeData.setStatus(postStatus);
		
		creator.addCreatedCommand(Wprr.commands.setValue(Wprr.sourceEvent("createdItem.linkedItem"), "title", "New data source"));
		creator.addCreatedCommand(Wprr.commands.setValue(Wprr.sourceEvent("createdItem.linkedItem"), "postStatus", postStatus));
		
		creator.addCreatedCommand(Wprr.commands.callFunction(this, this._itemCreated, [Wprr.sourceEvent("createdItem.id")]));
		
		creator.create();
	}
	
	_itemCreated(aId) {
		this._elementTreeItem.getLinks("items").addItem(aId);
	}
	
	_renderMainElement() {
		return <div>
			<Wprr.ReferenceInjection injectData={{"editorItem": this._elementTreeItem, "table": Wprr.sourceStatic(this._elementTreeItem, "table.linkedItem")}}>
				<Wprr.layout.admin.editorsgroup.editors.EditorsGroup>
					<Wprr.layout.admin.editorsgroup.SaveAllGroup>
						<div>
							<Wprr.HasData check={this._elementTreeItem.getValueSource("loaded")}>
								<React.Fragment>
									<Wprr.InsertElement element={Wprr.sourceReference("table", "headerRowElement")} />
									<Wprr.layout.ItemList ids={this._elementTreeItem.getLinks("filteredItems").idsSource} as="row">
										<Wprr.RelatedItem id="forItem.linkedItem" from={Wprr.sourceReference("row")} as="item">
											<Wprr.layout.loader.DataRangeLoader path={Wprr.sourceCombine("range/?select=idSelection,anyStatus&encode=relations&ids=", Wprr.sourceReference("item", "id"))} as="itemLoader">
												<Wprr.AddReference data={Wprr.sourceFunction(Wprr.sourceReference("editorsGroup"), "getItemEditor", [Wprr.sourceReference("item", "id")])} as="itemEditor">
													<Wprr.InsertElement element={Wprr.sourceReference("table", "rowElement")} />
												</Wprr.AddReference>
											</Wprr.layout.loader.DataRangeLoader>
										</Wprr.RelatedItem>
										<div className="spacing medium" data-slot="spacing" />
									</Wprr.layout.ItemList>
									<div className="spacing standard" />
									<Wprr.layout.List items={this._elementTreeItem.getType("paginationRange").sources.get("output")}>
										<Wprr.CommandButton commands={Wprr.commands.setProperty(this._elementTreeItem.getType("pagination"), "currentPage", Wprr.sourceReference("loop/item"))}>
											<Wprr.Adjust adjust={Wprr.adjusts.classFromComparison(Wprr.sourceReference("loop/item"), this._elementTreeItem.getType("pagination").sources.get("currentPage"), "===", "bold-text")} sourceUpdates={this._elementTreeItem.getType("pagination").sources.get("currentPage")}>
												<div className="cursor-pointer">{Wprr.text(Wprr.sourceFunction(null, function(aValue) {return aValue+1}, [Wprr.sourceReference("loop/item")]))}</div>
											</Wprr.Adjust>
										</Wprr.CommandButton>
										<Wprr.FlexRow data-slot="insertElements" className="micro-item-spacing justify-center flex-wrap" />
									</Wprr.layout.List>
								</React.Fragment>
							</Wprr.HasData>
							<Wprr.FlexRow>
								<Wprr.layout.interaction.Button text="Create" commands={Wprr.commands.callFunction(this, this._create)} />
							</Wprr.FlexRow>
							<Wprr.HasData check={this._elementTreeItem.getValueSource("loaded")} checkType="invert/default">
								<Wprr.layout.loader.LoaderDisplay />
							</Wprr.HasData>
						</div>
					</Wprr.layout.admin.editorsgroup.SaveAllGroup>
				</Wprr.layout.admin.editorsgroup.editors.EditorsGroup>
			</Wprr.ReferenceInjection>
		</div>;
	}
	
	static getWpAdminEditor() {
		//console.log("getWpAdminEditor");
		
		let dataSettings = {
			
		};
		
		return React.createElement(Wprr.layout.admin.WpBlockEditor, {dataSettings: dataSettings});
	}
}
