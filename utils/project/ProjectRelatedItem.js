import Wprr from "wprr/Wprr";

// import ProjectRelatedItem from "wprr/utils/project/ProjectRelatedItem";
export default class ProjectRelatedItem {
	
	constructor() {
		this._project = null;
	}
	
	get project() {
		return this._project;
	}
	
	set project(aValue) {
		this.setProject(aValue);
		
		return aValue;
	}
	
	setProject(aProject) {
		this._project = aProject;
		
		return this;
	}
	
	relateToProject(aName) {
		this.project = wprr.getProject(aName);
		
		return this;
	}
}