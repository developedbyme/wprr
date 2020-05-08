import SelectionAreaCreator from "wprr/wp/SelectionAreaCreator";
import RouteCreator from "wprr/routing/RouteCreator";
import ResponsiveTemplateFactory from "wprr/elements/layout/ResponsiveTemplateFactory";
import UseMarkupCreator from "wprr/markup/UseMarkupCreator";
import DbmContentSelectionAreaCreator from "wprr/wp/dbmcontent/DbmContentSelectionAreaCreator";
import SwitchableAreaCreator from "wprr/elements/layout/SwitchableAreaCreator";

let selectionArea = SelectionAreaCreator.create;
export {selectionArea};
let responsiveTemplate = ResponsiveTemplateFactory.create;
export {responsiveTemplate};
let routeCreator = RouteCreator.create;
export {routeCreator};
let useMarkup = UseMarkupCreator.create;
export {useMarkup};
let dbmContentSelectionArea = DbmContentSelectionAreaCreator.create;
export {dbmContentSelectionArea};
let switchableArea = SwitchableAreaCreator.create;
export {switchableArea};