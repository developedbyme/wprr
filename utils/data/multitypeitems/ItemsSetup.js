import Wprr from "wprr/Wprr";

export default class ItemsSetup {

	constructor() {
		
	}
	
	static setupFields(aItem, aData) {
		
		if(!aItem.hasType("messageGroup")) {
			let internalMessageGroup = new Wprr.utils.wp.dbmcontent.im.InternalMessageGroup();
			aItem.addType("messageGroup", internalMessageGroup);
			
			internalMessageGroup.setup(aData);
			aItem.addType("loaded/fields", true);
		}
	}
	
	static addTypesByName(aItem, aNames) {
		let items = aItem.group;
		let links = aItem.getLinks("taxonomy/dbm_type/terms");
		let taxonomy = items.getItem("taxonomy-dbm_type");
		
		let currentArray = aNames;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let currentName = currentArray[i];
			
			let termItemId = Wprr.objectPath(taxonomy, "termBySlugPath." + currentName + ".id");
			
			links.addUniqueItem(termItemId);
		}
	}
	
	static setupRelations(aItem, aData) {
		//console.log("setupRelations");
		//console.log(aItem, aData);
		
		let items = aItem.group;
		
		{
			let relations = aItem.getLinks("relations/incoming");
			let currentArray = aData.relations.incoming;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				
				let currentRelationData = currentArray[i];
				
				let fromId = currentRelationData["fromId"];
				let toId = currentRelationData["toId"];
				let relationId = currentRelationData["id"];
				let linkedItem = items.getItem(fromId);
				
				ItemsSetup.addTypesByName(aItem, currentRelationData["toTypes"]);
				ItemsSetup.addTypesByName(linkedItem, currentRelationData["fromTypes"]);
				
				let relationItem = items.getItem(relationId);
				if(!relationItem.hasType("relation")) {
					let relation = new Wprr.wp.dbmcontent.relation.Relation();
					relationItem.addType("relation", relation);
					relationItem.setup(currentRelationData);
					
					relationItem.addSingleLink("from", fromId);
					relationItem.addSingleLink("to", toId);
					
					let connectionTypeName = currentRelationData["connectionType"];
					let dbmTypeTaxonomy = items.getItem("taxonomy-dbm_type");
					let termItemId = Wprr.objectPath(dbmTypeTaxonomy, "termBySlugPath.object-relation/" + connectionTypeName + ".id");
					
					relationItem.addSingleLink("connectionType", termItemId);
				}
				
				relations.addUniqueItem(relationId);
				
				linkedItem.getLinks("relations/outgoing").addUniqueItem(relationId);
			}
			
			aItem.addType("loaded/relations/incoming", true);
		}
		{
			let relations = aItem.getLinks("relations/outgoing");
			let currentArray = aData.relations.outgoing;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				
				let currentRelationData = currentArray[i];
				
				let fromId = currentRelationData["fromId"];
				let toId = currentRelationData["toId"];
				let relationId = currentRelationData["id"];
				let linkedItem = items.getItem(toId);
				
				ItemsSetup.addTypesByName(linkedItem, currentRelationData["toTypes"]);
				ItemsSetup.addTypesByName(aItem, currentRelationData["fromTypes"]);
				
				let relationItem = items.getItem(relationId);
				if(!relationItem.hasType("relation")) {
					let relation = new Wprr.wp.dbmcontent.relation.Relation();
					relationItem.addType("relation", relation);
					relationItem.setup(currentRelationData);
					
					relationItem.addSingleLink("from", fromId);
					relationItem.addSingleLink("to", toId);
				}
				
				relations.addUniqueItem(relationId);
				
				linkedItem.getLinks("relations/incoming").addUniqueItem(relationId);
			}
			
			aItem.addType("loaded/relations/outgoing", true);
		}
		
		//METODO: orders
		//METODO: user relations
		
		//console.log(aItem);
	}
	
	static setupTitle(aItem, aData) {
		//console.log("setupTitle");
		//console.log(aItem, aData);
		
		aItem.addType("title", aData["title"]);
	}
	
	static setupTerms(aItem, aData) {
		//console.log("setupTerms");
		//console.log(aItem, aData);
		
		let terms = Wprr.objectPath(aData, "terms");
		for(let taxonomyName in terms) {
			let currentTerms = terms[taxonomyName];
			
			let currentIds = new Array();
			
			let currentArray = currentTerms;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentTerm = currentArray[i];
				let currentId = "term" + currentTerm["id"];
				
				currentIds.push(currentId);
				
				//METODO: set up term if not existing
			}
			
			aItem.getLinks("terms/" + taxonomyName).addItems(currentIds);
			aItem.addType("activeTerms", new Wprr.utils.data.GetChildTerms());
		}
		//aItem.addType("title", aData["title"]);
	}
}