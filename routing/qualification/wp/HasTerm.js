import objectPath from "object-path";

import Qualification from "wprr/routing/qualification/Qualification";

//import HasTerm from "wprr/routing/qualification/wp/HasTerm";
/**
 * Qualification that checks if a page has a term.
 */
export default class HasTerm extends Qualification {
	
	/**
	 * Constructor
	 */
	constructor() {
		super();
		
		this.setInput("taxonomy", null);
		this.setInput("matchTerm", null);
		this.setInput("field", "slug");
		
	}
	
	/**
	 * Evaluates if this qualification meets the correct criteria, which it does if the term exists.
	 *
	 * @param	aData	*	The data that needs to meet the correct criteria.
	 *
	 * @return	Boolean	The result of the evalutation.
	 */
	qualify(aData) {
		//console.log("wprr/routing/qualification/wp/HasTerm::qualify");
		//console.log(aData);
		
		let taxonomy = this.getInput("taxonomy");
		let matchTerm = this.getInput("matchTerm");
		let field = this.getInput("field");
		
		let terms = objectPath.get(aData, "queriedData.terms." + taxonomy);
		if(terms) {
			let currentArray = terms;
			let currentArrayLength = currentArray.length;
			for(let i = 0; i < currentArrayLength; i++) {
				let currentTerm = currentArray[i];
				if(currentTerm[field] === matchTerm) {
					return true;
				}
			}
		}
		
		return false;
	}
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aTaxonomy	String	The taxonomy to check in.
	 * @param	aMatchTerm	*		The value that the term should match.
	 * @param	aField		String	The field to check (eg. id, slug, name).
	 *
	 * @return	HasTerm	The new instance
	 */
	static create(aTaxonomy, aMatchTerm, aField = null) {
		let newHasTerm = new HasTerm();
		newHasTerm.setInputWithoutNull("taxonomy", aTaxonomy);
		newHasTerm.setInputWithoutNull("matchTerm", aMatchTerm);
		newHasTerm.setInputWithoutNull("field", aField);
		
		return newHasTerm;
	}
}