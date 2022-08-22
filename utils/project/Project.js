import Wprr from "wprr/Wprr";
import React from "react";

// import Project from "wprr/utils/project/Project";
export default class Project {
	
	constructor() {
		this._name = null;
		this._mainReferences = null;
		this._items = new Wprr.utils.data.MultiTypeItemsGroup();
		this._items.setProject(this);
		
		let projectItem = this._items.getItem("project");
		projectItem.addType("controller", this);
		
		let session = this._items.createInternalItem();
		projectItem.addSingleLink("session", session.id);
		
		let cacheKey = Math.round(Math.random()*1000000000);
		
		session.addType("variables", new Wprr.utils.data.nodes.ValueSources());
		session.requireSingleLink("user");
		session.setValue("cacheKey", cacheKey);
		session.requireValue("restNonce");
		session.requireValue("checkedLoginStatus", false);
		
		let cart = this._items.createInternalItem();
		session.addSingleLink("cart", cart.id);
		//METODO: add cart node
		cart.setValue("cacheKey", cacheKey);
		cart.setValue("loaded", false);
		cart.getLinks("items");
		cart.getLinks("coupons");
		
		let pathsItem = this._items.createInternalItem();
		
		let pathController = Wprr.utils.data.multitypeitems.controllers.paths.PathController.create(pathsItem);
		
		projectItem.addSingleLink("paths", pathsItem.id);
		
		pathController.setFullPath("");
		
		let pathCustomizerItem = this._items.createInternalItem();
		
		let pathCustomizer = Wprr.utils.data.multitypeitems.controllers.paths.PathCustomizer.create(pathCustomizerItem);
		pathCustomizerItem.addSingleLink("paths", pathsItem.id);
		
		projectItem.addSingleLink("pathCustomizer", pathCustomizerItem.id);
		
		let trackingItem = this._items.createInternalItem();
		
		let trackingController = Wprr.utils.data.multitypeitems.controllers.tracking.TrackingController.create(trackingItem);
		
		projectItem.addSingleLink("tracking", trackingItem.id);
		
		let itemsSetupItem = this._items.getItem("itemsSetup");
		let typeLinks = itemsSetupItem.getNamedLinks("types");
		
		this._items.addSetup("id", Wprr.utils.data.multitypeitems.setup.None.prepare, Wprr.utils.data.multitypeitems.setup.None.setup);
		this._items.addSetup("preview", Wprr.utils.data.multitypeitems.setup.None.prepare, Wprr.utils.data.multitypeitems.setup.None.setup);
		
		this._items.addSetup("dataRangeLoader", Wprr.utils.data.multitypeitems.setup.DataRangeLoader.prepare, Wprr.utils.data.multitypeitems.setup.DataRangeLoader.setup);
		this._items.addSetup("featuredImage", Wprr.utils.data.multitypeitems.setup.FeaturedImage.prepare, Wprr.utils.data.multitypeitems.setup.FeaturedImage.setup);
		this._items.addSetup("image", Wprr.utils.data.multitypeitems.setup.Image.prepare, Wprr.utils.data.multitypeitems.setup.Image.setup);
		this._items.addSetup("permalink", Wprr.utils.data.multitypeitems.setup.Permalink.prepare, Wprr.utils.data.multitypeitems.setup.Permalink.setup);
		this._items.addSetup("taxonomyTerm", Wprr.utils.data.multitypeitems.setup.TaxonomyTerm.prepare, Wprr.utils.data.multitypeitems.setup.TaxonomyTerm.setup);
		this._items.addSetup("menuItem", Wprr.utils.data.multitypeitems.setup.MenuItem.prepare, Wprr.utils.data.multitypeitems.setup.MenuItem.setup);
		this._items.addSetup("menuItem/post_type", Wprr.utils.data.multitypeitems.setup.menuitemtypes.PostType.prepare, Wprr.utils.data.multitypeitems.setup.menuitemtypes.PostType.setup);
		this._items.addSetup("menuItem/custom", Wprr.utils.data.multitypeitems.setup.menuitemtypes.Custom.prepare, Wprr.utils.data.multitypeitems.setup.menuitemtypes.Custom.setup);
		this._items.addSetup("menuItem/taxonomy", Wprr.utils.data.multitypeitems.setup.menuitemtypes.Taxonomy.prepare, Wprr.utils.data.multitypeitems.setup.menuitemtypes.Taxonomy.setup);
		this._items.addSetup("relation", Wprr.utils.data.multitypeitems.setup.Relation.prepare, Wprr.utils.data.multitypeitems.setup.Relation.setup);
		this._items.addSetup("relations", Wprr.utils.data.multitypeitems.setup.Relations.prepare, Wprr.utils.data.multitypeitems.setup.Relations.setup);
		this._items.addSetup("objectTypes", Wprr.utils.data.multitypeitems.setup.ObjectTypes.prepare, Wprr.utils.data.multitypeitems.setup.ObjectTypes.setup);
		this._items.addSetup("fields", Wprr.utils.data.multitypeitems.setup.Fields.prepare, Wprr.utils.data.multitypeitems.setup.Fields.setup);
		this._items.addSetup("fieldsStructure", Wprr.utils.data.multitypeitems.setup.FieldsStructure.prepare, Wprr.utils.data.multitypeitems.setup.FieldsStructure.setup);
		this._items.addSetup("fieldTemplate", Wprr.utils.data.multitypeitems.setup.FieldTemplate.prepare, Wprr.utils.data.multitypeitems.setup.FieldTemplate.setup);
		this._items.addSetup("fieldTemplate/relation", Wprr.utils.data.multitypeitems.setup.fieldtemplatetypes.Relation.prepare, Wprr.utils.data.multitypeitems.setup.fieldtemplatetypes.Relation.setup);
		this._items.addSetup("postTitle", Wprr.utils.data.multitypeitems.setup.PostTitle.prepare, Wprr.utils.data.multitypeitems.setup.PostTitle.setup);
		this._items.addSetup("postStatus", Wprr.utils.data.multitypeitems.setup.PostStatus.prepare, Wprr.utils.data.multitypeitems.setup.PostStatus.setup);
		this._items.addSetup("taxonomy", Wprr.utils.data.multitypeitems.setup.Taxonomy.prepare, Wprr.utils.data.multitypeitems.setup.Taxonomy.setup);
		this._items.addSetup("type", Wprr.utils.data.multitypeitems.setup.Type.prepare, Wprr.utils.data.multitypeitems.setup.Type.setup);
		this._items.addSetup("user", Wprr.utils.data.multitypeitems.setup.User.prepare, Wprr.utils.data.multitypeitems.setup.User.setup);
		this._items.addSetup("postExcerpt", Wprr.utils.data.multitypeitems.setup.PostExcerpt.prepare, Wprr.utils.data.multitypeitems.setup.PostExcerpt.setup);
		this._items.addSetup("publishDate", Wprr.utils.data.multitypeitems.setup.PublishDate.prepare, Wprr.utils.data.multitypeitems.setup.PublishDate.setup);
		this._items.addSetup("postTerms", Wprr.utils.data.multitypeitems.setup.PostTerms.prepare, Wprr.utils.data.multitypeitems.setup.PostTerms.setup);
		this._items.addSetup("product", Wprr.utils.data.multitypeitems.setup.Product.prepare, Wprr.utils.data.multitypeitems.setup.Product.setup);
		this._items.addSetup("orderItems", Wprr.utils.data.multitypeitems.setup.OrderItems.prepare, Wprr.utils.data.multitypeitems.setup.OrderItems.setup);
		this._items.addSetup("order/items", Wprr.utils.data.multitypeitems.setup.OrderItems.prepare, Wprr.utils.data.multitypeitems.setup.OrderItems.setup);
		this._items.addSetup("order/totals", Wprr.utils.data.multitypeitems.setup.order.Totals.prepare, Wprr.utils.data.multitypeitems.setup.order.Totals.setup);
		this._items.addSetup("order/paymentMethod", Wprr.utils.data.multitypeitems.setup.order.PaymentMethod.prepare, Wprr.utils.data.multitypeitems.setup.order.PaymentMethod.setup);
		this._items.addSetup("order/creationType", Wprr.utils.data.multitypeitems.setup.order.CreationType.prepare, Wprr.utils.data.multitypeitems.setup.order.CreationType.setup);
		this._items.addSetup("order/paidDate", Wprr.utils.data.multitypeitems.setup.order.PaidDate.prepare, Wprr.utils.data.multitypeitems.setup.order.PaidDate.setup);
		this._items.addSetup("order/subscription", Wprr.utils.data.multitypeitems.setup.order.Subscription.prepare, Wprr.utils.data.multitypeitems.setup.order.Subscription.setup);
		this._items.addSetup("subscriptionDates", Wprr.utils.data.multitypeitems.setup.SubscriptionDates.prepare, Wprr.utils.data.multitypeitems.setup.SubscriptionDates.setup);
		this._items.addSetup("postContent", Wprr.utils.data.multitypeitems.setup.PostContent.prepare, Wprr.utils.data.multitypeitems.setup.PostContent.setup);
		this._items.addSetup("postType", Wprr.utils.data.multitypeitems.setup.PostType.prepare, Wprr.utils.data.multitypeitems.setup.PostType.setup);
		this._items.addSetup("pageDataSources", Wprr.utils.data.multitypeitems.setup.PageDataSources.prepare, Wprr.utils.data.multitypeitems.setup.PageDataSources.setup);
		this._items.addSetup("dataSource", Wprr.utils.data.multitypeitems.setup.DataSource.prepare, Wprr.utils.data.multitypeitems.setup.DataSource.setup);
		this._items.addSetup("pageSettings", Wprr.utils.data.multitypeitems.setup.PageSettings.prepare, Wprr.utils.data.multitypeitems.setup.PageSettings.setup);
		this._items.addSetup("pageSetting", Wprr.utils.data.multitypeitems.setup.PageSetting.prepare, Wprr.utils.data.multitypeitems.setup.PageSetting.setup);
		this._items.addSetup("breadcrumb", Wprr.utils.data.multitypeitems.setup.Breadcrumb.prepare, Wprr.utils.data.multitypeitems.setup.Breadcrumb.setup);
		this._items.addSetup("sequenceNumber", Wprr.utils.data.multitypeitems.setup.SequenceNumber.prepare, Wprr.utils.data.multitypeitems.setup.SequenceNumber.setup);
		this._items.addSetup("pageTemplate", Wprr.utils.data.multitypeitems.setup.PageTemplate.prepare, Wprr.utils.data.multitypeitems.setup.PageTemplate.setup);
		this._items.addSetup("task", Wprr.utils.data.multitypeitems.setup.Task.prepare, Wprr.utils.data.multitypeitems.setup.Task.setup);
		this._items.addSetup("itemInProcess", Wprr.utils.data.multitypeitems.setup.ItemInProcess.prepare, Wprr.utils.data.multitypeitems.setup.ItemInProcess.setup);
		this._items.addSetup("process", Wprr.utils.data.multitypeitems.setup.Process.prepare, Wprr.utils.data.multitypeitems.setup.Process.setup);
		this._items.addSetup("processPart", Wprr.utils.data.multitypeitems.setup.ProcessPart.prepare, Wprr.utils.data.multitypeitems.setup.ProcessPart.setup);
		this._items.addSetup("relatedProducts", Wprr.utils.data.multitypeitems.setup.RelatedProducts.prepare, Wprr.utils.data.multitypeitems.setup.RelatedProducts.setup);
		this._items.addSetup("description", Wprr.utils.data.multitypeitems.setup.Description.prepare, Wprr.utils.data.multitypeitems.setup.Description.setup);
		this._items.addSetup("imagesFor", Wprr.utils.data.multitypeitems.setup.ImagesFor.prepare, Wprr.utils.data.multitypeitems.setup.ImagesFor.setup);
		this._items.addSetup("identifier", Wprr.utils.data.multitypeitems.setup.Identifier.prepare, Wprr.utils.data.multitypeitems.setup.Identifier.setup);
		this._items.addSetup("tags", Wprr.utils.data.multitypeitems.setup.Tags.prepare, Wprr.utils.data.multitypeitems.setup.Tags.setup);
		this._items.addSetup("dataImage", Wprr.utils.data.multitypeitems.setup.DataImage.prepare, Wprr.utils.data.multitypeitems.setup.DataImage.setup);
		this._items.addSetup("subscription/orders", Wprr.utils.data.multitypeitems.setup.subscription.Orders.prepare, Wprr.utils.data.multitypeitems.setup.subscription.Orders.setup);
		this._items.addSetup("discountCode", Wprr.utils.data.multitypeitems.setup.discountcode.DiscountCode.prepare, Wprr.utils.data.multitypeitems.setup.discountcode.DiscountCode.setup);
		this._items.addSetup("discountCode/recurring_percent", Wprr.utils.data.multitypeitems.setup.discountcode.types.RecurringPercent.prepare, Wprr.utils.data.multitypeitems.setup.discountcode.types.RecurringPercent.setup);
		this._items.addSetup("relationOrder", Wprr.utils.data.multitypeitems.setup.RelationOrder.prepare, Wprr.utils.data.multitypeitems.setup.RelationOrder.setup);
		this._items.addSetup("contentTemplate", Wprr.utils.data.multitypeitems.setup.ContentTemplate.prepare, Wprr.utils.data.multitypeitems.setup.ContentTemplate.setup);
		this._items.addSetup("templatePosition", Wprr.utils.data.multitypeitems.setup.TemplatePosition.prepare, Wprr.utils.data.multitypeitems.setup.TemplatePosition.setup);
		this._items.addSetup("value", Wprr.utils.data.multitypeitems.setup.Value.prepare, Wprr.utils.data.multitypeitems.setup.Value.setup);
		this._items.addSetup("triggers", Wprr.utils.data.multitypeitems.setup.Triggers.prepare, Wprr.utils.data.multitypeitems.setup.Triggers.setup);
		this._items.addSetup("trigger", Wprr.utils.data.multitypeitems.setup.Trigger.prepare, Wprr.utils.data.multitypeitems.setup.Trigger.setup);
		this._items.addSetup("shortTitle", Wprr.utils.data.multitypeitems.setup.ShortTitle.prepare, Wprr.utils.data.multitypeitems.setup.ShortTitle.setup);
		this._items.addSetup("action", Wprr.utils.data.multitypeitems.setup.Action.prepare, Wprr.utils.data.multitypeitems.setup.Action.setup);
		
		let relationEditors = this._items.getItem("admin/editorsForType/object-relation");
		
		{
			let currentEditor = this._items.getItem("admin/itemEditors/relationHeader");
			currentEditor.setValue("element", React.createElement(Wprr.layout.admin.item.editors.RelationHeader, null));
			relationEditors.getLinks("elements").addItem(currentEditor.id);
		}
		
		{
			let currentEditor = this._items.getItem("admin/itemEditors/postApiCommand");
			currentEditor.setValue("element", React.createElement(Wprr.layout.admin.item.editors.PostApiCommand, null));
			relationEditors.getLinks("elements").addItem(currentEditor.id);
		}
		
		let defaultEditors = this._items.getItem("admin/defaultItemEditors");
		
		{
			let currentEditor = this._items.getItem("admin/itemEditors/itemHeader");
			currentEditor.setValue("element", React.createElement(Wprr.layout.admin.item.editors.ItemHeader, null));
			defaultEditors.getLinks("elements").addItem(currentEditor.id);
		}
		
		{
			let currentEditor = this._items.getItem("admin/itemEditors/postApiCommand");
			currentEditor.setValue("element", React.createElement(Wprr.layout.admin.item.editors.PostApiCommand, null));
			defaultEditors.getLinks("elements").addItem(currentEditor.id);
		}
		
		{
			let currentEditor = this._items.getItem("admin/itemEditors/relationLinks");
			currentEditor.setValue("element", React.createElement(Wprr.layout.admin.item.editors.RelationLinks, null));
			defaultEditors.getLinks("elements").addItem(currentEditor.id);
		}
		
		let processPartElements = projectItem.getNamedLinks("processPartElements");
	}
	
	get name() {
		return this._name;
	}
	
	get mainReferences() {
		return this._mainReferences;
	}
	
	get items() {
		return this._items;
	}
	
	get tracking() {
		return Wprr.objectPath(this.items, "project.tracking.linkedItem.trackingController");
	}
	
	setName(aName) {
		this._name = aName;
		
		return this;
	}
	
	setMainReferences(aReferences) {
		this._mainReferences = aReferences;
		
		return this;
	}
	
	getTextManager() {
		return this._mainReferences.getObject("wprr/textManager");
	}
	
	getWprrUrl(aUrl, aLocation = "rest") {
		let urlResolver = this._mainReferences.getObject("urlResolver/" + aLocation);
		
		if(!urlResolver) {
			console.warn("No path for location " + aLocation);
			return aUrl;
		}
		
		return urlResolver.resolveUrl(aUrl, aLocation);
	}
	
	getLoader() {
		let loader = new Wprr.utils.JsonLoader();
		
		this.addUserCredentialsToLoader(loader);
		
		return loader;
	}
	
	getCreateLoader(aPostType = "dbm_data", aDataType = "none", aCreationMethod = "draft", aTitle = "New item") {
		let loader = new Wprr.utils.loading.CreateLoader();
		
		loader.setUrl(this.getWprrUrl(Wprr.utils.wprrUrl.getCreateUrl(aPostType)));
		loader.changeData.setTitle(aTitle);
		loader.changeData.addSetting("dataType", aDataType);
		loader.changeData.addSetting("creationMethod", aCreationMethod);
		this.addUserCredentialsToLoader(loader);
		
		return loader;
	}
	
	getEditLoader(aId) {
		let loader = new Wprr.utils.loading.EditLoader();
		
		loader.setUrl(this.getWprrUrl(Wprr.utils.wprrUrl.getEditUrl(aId)));
		this.addUserCredentialsToLoader(loader);
		
		return loader;
	}
	
	getActionLoader(aActionName, aData = null) {
		let loader = this.getLoader();
		
		loader.setUrl(this.getWprrUrl(Wprr.utils.wprrUrl.getActionUrl(aActionName)));
		loader.setMethod("POST");
		
		if(aData) {
			loader.setJsonPostBody(aData);
		}
		
		return loader;
	}
	
	getPerformActionLoader(aActionType, aFromIds = [], aData = null) {
		let loader = this.getCreateLoader("dbm_data", "action", "draft", "Action: " + aActionType);
		
		loader.changeData.addTypeRelation("type/action-type", aActionType);
		
		let currentArray = aFromIds;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			loader.changeData.addOutgoingRelation(currentArray[i], "from");
		}
		
		if(aData) {
			loader.changeData.addTerm("value-item", "dbm_type", "slugPath");
			loader.changeData.setDataField("value", aData);
		}
		
		loader.changeData.makePrivate();
		loader.changeData.createChange("dbmtc/processAction", {});
		
		return loader;
	}
	
	getLoginLoader(aLogin, aPassword, aRemember = false) {
		let loader = this.getActionLoader("login");
		loader.setJsonPostBody({
			"log": aLogin,
			"pwd": aPassword,
			"remember": aRemember,
		});
		
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this._callback_loginDataLoaded, [Wprr.sourceEvent("data")]));
		
		return loader;
	}
	
	_callback_loginDataLoaded(aData) {
		//console.log("_callback_loginDataLoaded");
		if(aData.authenticated) {
			this.setUserData({"restNonce": aData["restNonce"], "restNonceGeneratedAt": aData["restNonceGeneratedAt"], "roles": aData["roles"], "data": aData["user"]});
		}
	}
	
	getLogoutLoader() {
		let loader = this.getActionLoader("logout");
		
		loader.setJsonPostBody({});
		
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this.setUserData, [null]));
		
		return loader;
	}
	
	getSignupLoader(aData) {
		let loader = this.getActionLoader("register-user");
		
		loader.setJsonPostBody(aData);
		
		loader.addSuccessCommand(Wprr.commands.callFunction(this, this._callback_signupDataLoaded, [Wprr.sourceEvent("data")]));
		
		return loader;
	}
	
	_callback_signupDataLoaded(aData) {
		//console.log("_callback_loginDataLoaded");
		//console.log(aData);
		
		if(aData.registered) {
			this.setUserData({"restNonce": aData["restNonce"], "restNonceGeneratedAt": aData["restNonceGeneratedAt"], "roles": aData["roles"], "data": aData["user"]});
		}
	}
	
	getSharedLoader(aUrl) {
		//console.log("getSharedLoader");
		//console.log(aUrl, this._items);
		
		let pathController = Wprr.objectPath(this.items, "project.paths.linkedItem.children.wp.children.rest.pathController");
		
		let absolutePath = pathController.resolveRelativePath(aUrl);
		let item = this._items.getItem(absolutePath);
		
		if(!item.hasType("loader")) {
			let loader = new Wprr.utils.loading.JsonLoader();
			loader.setUrl(absolutePath);
			if(absolutePath.indexOf(document.location.protocol + "//" + document.location.host) === 0) {
				this.addUserCredentialsToLoader(loader);
			}
			item.requireValue("loaded", false);
			item.requireValue("data", null);
			loader.addSuccessCommand(Wprr.commands.setProperty(item.getType("data").reSource(), "value", Wprr.sourceEvent("data")));
			loader.addSuccessCommand(Wprr.commands.setProperty(item.getType("loaded").reSource(), "value", true));
			
			item.addType("loader", loader);
			
			
			//METODO: remove this legacy
			let storeController = this._mainReferences.getObject("redux/store/wprrController");
			storeController.addLoader(absolutePath, loader);
		}
		
		return item.getType("loader");
	}
	
	addUserCredentialsToLoader(aLoader) {
		
		let restNonce = Wprr.objectPath(this._items, "project.session.linkedItem.restNonce.value");
		
		if(restNonce) {
			aLoader.addHeader("X-WP-Nonce", restNonce);
		}
		
		return aLoader;
	}
	
	setUserData(aData) {
		console.log("setUserData");
		console.log(aData);
		
		let projectItem = this._items.getItem("project");
		let session = Wprr.objectPath(projectItem, "session.linkedItem");
		
		if(!aData) {
			session.getType("user").setId(0);
			session.setValue("restNonce", null);
		}
		else {
			
			session.setValue("restNonce", aData["restNonce"]);
			
			let userData = aData["data"];
			let userId = userData["id"];
			
			let user = this._items.getItem("user" + userId);
			
			user.setValue("name", userData["name"]);
			user.setValue("firstName", userData["firstName"]);
			user.setValue("lastName", userData["lastName"]);
			user.setValue("email", userData["email"]);
			user.setValue("roles", aData["roles"]);
			
			session.getType("user").setId("user" + userId);
		}
		
		session.setValue("checkedLoginStatus", true);
		
		let storeController = this._mainReferences.getObject("redux/store/wprrController");
		this._mainReferences.addObject("wprr/userData", aData);
		storeController.setUser(aData);
		
		return this;
	}
	
	setUser(aUserData, aRestNonce) {
		this.setUserData({"restNonce": aRestNonce, "roles": aUserData["roles"], "data": aUserData});
		
		return this;
	}
	
	getUserData() {
		return this._mainReferences.getObject("wprr/userData");
	}
	
	getCurrentLanguage() {
		return Wprr.objectPath(this._mainReferences.getObject("wprr/pageData"), "queryData.language");
	}
}