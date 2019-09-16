import CreateHierarchyTerms from "wprr/manipulation/adjustfunctions/wp/CreateHierarchyTerms";
import SelectTermsSubtree from "wprr/manipulation/adjustfunctions/wp/SelectTermsSubtree";
import OptionsFromHierarchyTerms from "wprr/manipulation/adjustfunctions/wp/OptionsFromHierarchyTerms";
import FilterOptions from "wprr/manipulation/adjustfunctions/logic/FilterOptions";
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
import Ratio from "wprr/manipulation/adjustfunctions/logic/Ratio";
import StyleFromHeight from "wprr/manipulation/adjustfunctions/css/StyleFromHeight";
import StyleFromSize from "wprr/manipulation/adjustfunctions/css/StyleFromSize";
import ValueToState from "wprr/manipulation/adjustfunctions/logic/ValueToState";
import HtmlToText from "wprr/manipulation/adjustfunctions/text/HtmlToText";
import FilterArray from "wprr/manipulation/adjustfunctions/logic/FilterArray";
import FilterArrayWithCommand from "wprr/manipulation/adjustfunctions/logic/FilterArrayWithCommand";
import DynamicKey from "wprr/manipulation/adjustfunctions/DynamicKey";
import SetDefaultProps from "wprr/manipulation/adjustfunctions/SetDefaultProps";
import ConvertTermField from "wprr/manipulation/adjustfunctions/wp/ConvertTermField";
import GroupArray from "wprr/manipulation/adjustfunctions/logic/GroupArray";
import SortArray from "wprr/manipulation/adjustfunctions/logic/SortArray";
import OptionsFromRange from "wprr/manipulation/adjustfunctions/wp/OptionsFromRange";
import SelectItemInArray from "wprr/manipulation/adjustfunctions/logic/SelectItemInArray";
import GetFirstResolvingSource from "wprr/manipulation/adjustfunctions/GetFirstResolvingSource";
import SwitchValue from "wprr/manipulation/adjustfunctions/logic/SwitchValue";
import SliderControl from "wprr/manipulation/adjustfunctions/control/slider/SliderControl";
import ApplyFilterChain from "wprr/manipulation/adjustfunctions/logic/ApplyFilterChain";
import MapPropertyInArray from "wprr/manipulation/adjustfunctions/logic/MapPropertyInArray";
import LabelFromOptions from "wprr/manipulation/adjustfunctions/text/LabelFromOptions";
import AdditionalDataFromOptions from "wprr/manipulation/adjustfunctions/text/AdditionalDataFromOptions";
import ApplySortChain from "wprr/manipulation/adjustfunctions/logic/ApplySortChain";
import IsUrlAtPath from "wprr/manipulation/adjustfunctions/browser/IsUrlAtPath";
import JoinArray from "wprr/manipulation/adjustfunctions/text/JoinArray";
import ClosestIndex from "wprr/manipulation/adjustfunctions/logic/ClosestIndex";
import AnyOf from "wprr/manipulation/adjustfunctions/logic/AnyOf";
import OptionsFromTaxonomies from "wprr/manipulation/adjustfunctions/wp/OptionsFromTaxonomies";

let createHierarchyTerms = CreateHierarchyTerms.create;
export {createHierarchyTerms};
let selectTermsSubtree = SelectTermsSubtree.create;
export {selectTermsSubtree};
let optionsFromHierarchyTerms = OptionsFromHierarchyTerms.create;
export {optionsFromHierarchyTerms};
let filterOptions = FilterOptions.create;
export {filterOptions};
let addToArray = AddToArray.create;
export {addToArray};
let filterArray = FilterArray.create;
export {filterArray};
let filterArrayWithCommand = FilterArrayWithCommand.create;
export {filterArrayWithCommand};
let classFromProp = ClassFromProp.create;
export {classFromProp};
let classFromValue = ClassFromProp.createWithSource;
export {classFromValue};
let resolveSources = ResolveSources.create;
export {resolveSources};
let markupLoop = MarkupLoop.create;
export {markupLoop};
let optionsFromTerms = OptionsFromTerms.create;
export {optionsFromTerms};
let optionsFromRange = OptionsFromRange.create;
export {optionsFromRange};
let relationTerms = RelationTerms.create;
export {relationTerms};
let convertTermField = ConvertTermField.create;
export {convertTermField};
let groupArray = GroupArray.create;
export {groupArray};
let sortArray = SortArray.create;
export {sortArray};
let selectItemInArray = SelectItemInArray.create;
export {selectItemInArray};
let switchValue = SwitchValue.create;
export {switchValue};
let applyFilterChain = ApplyFilterChain.create;
export {applyFilterChain};
let applySortChain = ApplySortChain.create;
export {applySortChain};
let mapPropertyInArray = MapPropertyInArray.create;
export {mapPropertyInArray};
let labelFromOptions = LabelFromOptions.create;
export {labelFromOptions};
let additionalDataFromOptions = AdditionalDataFromOptions.create;
export {additionalDataFromOptions};
let isUrlAtPath = IsUrlAtPath.create;
export {isUrlAtPath};
let joinArray = JoinArray.create;
export {joinArray};
let closestIndex = ClosestIndex.create;
export {closestIndex};
let anyOf = AnyOf.create;
export {anyOf};
let optionsFromTaxonomies = OptionsFromTaxonomies.create;
export {optionsFromTaxonomies};


let filterProps = FilterProps.create;
export {filterProps};
let removeProps = RemoveProps.create;
export {removeProps};
let renameProp = RenameProp.create;
export {renameProp};
let defaultProps = SetDefaultProps.create;
export {defaultProps};

let dynamicKey = DynamicKey.create;
export {dynamicKey};

let condition = Condition.create;
export {condition};
let valueToState = ValueToState.create;
export {valueToState};
let htmlToText = HtmlToText.create;
export {htmlToText};

let fittingItems = FittingItems.create;
export {fittingItems};
let ratio = Ratio.create;
export {ratio};
let styleFromHeight = StyleFromHeight.create;
export {styleFromHeight};
let styleFromSize = StyleFromSize.create;
export {styleFromSize};

let getFirstResolvingSource = GetFirstResolvingSource.create;
export {getFirstResolvingSource};

let sliderControl = SliderControl.create;
export {sliderControl};
