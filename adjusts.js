import CreateHierarchyTerms from "wprr/manipulation/adjustfunctions/wp/CreateHierarchyTerms";
import SelectTermsSubtree from "wprr/manipulation/adjustfunctions/wp/SelectTermsSubtree";
import OptionsFromHierarchyTerms from "wprr/manipulation/adjustfunctions/wp/OptionsFromHierarchyTerms";
import AddToArray from "wprr/manipulation/adjustfunctions/logic/AddToArray";
import ClassFromProp from "wprr/manipulation/adjustfunctions/ClassFromProp";
import ResolveSources from "wprr/manipulation/adjustfunctions/ResolveSources";
import MarkupLoop from "wprr/manipulation/adjustfunctions/loop/MarkupLoop";
import OptionsFromTerms from "wprr/manipulation/adjustfunctions/wp/OptionsFromTerms";
import RelationTerms from "wprr/manipulation/adjustfunctions/wp/dbmcontent/RelationTerms";
import FilterProps from "wprr/manipulation/adjustfunctions/FilterProps";
import RemoveProps from "wprr/manipulation/adjustfunctions/RemoveProps";
import RenameProp from "wprr/manipulation/adjustfunctions/RenameProp";
import Condition from "wprr/manipulation/adjustfunctions/logic/Condition";
import FittingItems from "wprr/manipulation/adjustfunctions/measure/FittingItems";

let createHierarchyTerms = CreateHierarchyTerms.create;
export {createHierarchyTerms};
let selectTermsSubtree = SelectTermsSubtree.create;
export {selectTermsSubtree};
let optionsFromHierarchyTerms = OptionsFromHierarchyTerms.create;
export {optionsFromHierarchyTerms};
let addToArray = AddToArray.create;
export {addToArray};
let classFromProp = ClassFromProp.create;
export {classFromProp};
let resolveSources = ResolveSources.create;
export {resolveSources};
let markupLoop = MarkupLoop.create;
export {markupLoop};
let optionsFromTerms = OptionsFromTerms.create;
export {optionsFromTerms};
let relationTerms = RelationTerms.create;
export {relationTerms};

let filterProps = FilterProps.create;
export {filterProps};
let removeProps = RemoveProps.create;
export {removeProps};
let renameProp = RenameProp.create;
export {renameProp};

let condition = Condition.create;
export {condition};

let fittingItems = FittingItems.create;
export {fittingItems};
