// import ReactChildFunctions from "wprr/utils/ReactChildFunctions";
/**
 * Functions to get children from react components.
 */
export default class ReactChildFunctions {
	
	/**
	 * Gets the children of a component.
	 *
	 * @param	aComponent	React.Component or React element
	 *
	 * @return	Array	The children of the component
	 */
	static getChildrenForComponent(aComponent) {
		//MENOTE: aComponent.props.children can be undefiend, the only child or an array
		//MENOTE: it can also be a function
		
		var children = aComponent.props.children;
		
		if(children == undefined) {
			return [];
		}
		
		if(children instanceof Array) {
			return children;
		}
		else {
			return [children];
		}
	}
	
	/**
	 * Gets the dynamicChildren prop or children of a component. The dynamicChildren prop is prioritized over normal children.
	 *
	 * @param	aComponent	React.Component or React element
	 *
	 * @return	Array	The children of the component.
	 */
	static getInputChildrenForComponent(aComponent) {
		//MENOTE: aComponent.props.children can be undefiend, the only child or an array
		//MENOTE: it can also be a function
		
		var children = aComponent.props.dynamicChildren ? aComponent.props.dynamicChildren : aComponent.props.children;
		
		if(children == undefined) {
			return [];
		}
		
		if(children instanceof Array) {
			return children;
		}
		else {
			return [children];
		}
	}
	
	/**
	 * Gets the child of a component. If multiple children exists the first child is returned.
	 *
	 * @param	aComponent	React.Component or React element
	 *
	 * @return	React element	The child of the component. Null is returned if there are no children.
	 */
	static getSingleInputChildForComponent(aComponent) {
		//MENOTE: this.props.children can be undefiend, the only child or an array
		
		var children = aComponent.props.children;
		if(children == undefined) {
			
			return null;
		}
		
		var firstChild;
		if(children instanceof Array) {
			if(children.length > 1) {
				console.warn("Object has to many children. Using first element for ", aComponent);
			}
			firstChild = children[0];
		}
		else {
			firstChild = children;
		}
		
		return firstChild;
	}
}