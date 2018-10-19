import SelectionAreaCreator from "wprr/wp/SelectionAreaCreator";
import RouteCreator from "wprr/routing/RouteCreator";
import ResponsiveTemplateFactory from "wprr/elements/layout/ResponsiveTemplateFactory";

let selectionArea = SelectionAreaCreator.create;
export {selectionArea};
let responsiveTemplate = ResponsiveTemplateFactory.create;
export {responsiveTemplate};
let routeCreator = RouteCreator.create;
export {routeCreator};