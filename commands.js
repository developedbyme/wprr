import CallFunctionCommand from "wprr/commands/basic/CallFunctionCommand";
import LoadUrlCommand from "wprr/commands/loading/LoadUrlCommand";
import SetValueCommand from "wprr/commands/basic/SetValueCommand";
import ToggleValueCommand from "wprr/commands/basic/ToggleValueCommand";
import PerformSelectedCommands from "wprr/commands/logic/PerformSelectedCommands";
import SetStateValueCommand from "wprr/commands/basic/SetStateValueCommand";
import ReloadPageCommand from "wprr/commands/navigation/ReloadPageCommand";
import NavigationCommand from "wprr/commands/navigation/NavigationCommand";
import ForceUpdateCommand from "wprr/commands/navigation/ForceUpdateCommand";
import InjectReferencesCommand from "wprr/commands/elements/InjectReferencesCommand";
import TriggerCommand from "wprr/commands/basic/TriggerCommand";
import ReactRouterPushCommand from "wprr/commands/thirdparty/reactrouter/ReactRouterPushCommand";
import ScrollToCommand from "wprr/commands/browser/ScrollToCommand";
import AnimateCommand from "wprr/commands/animation/AnimateCommand";
import DelayCommand from "wprr/commands/animation/DelayCommand";
import SubmitFormCommand from "wprr/commands/navigation/SubmitFormCommand";
import AlertCommand from "wprr/commands/browser/AlertCommand";
import ShowOverlayCommand from "wprr/commands/navigation/ShowOverlayCommand";
import CloseCurrentOverlayCommand from "wprr/commands/navigation/CloseCurrentOverlayCommand";
import StopPropagationCommand from "wprr/commands/browser/StopPropagationCommand";
import PreventDefaultCommand from "wprr/commands/browser/PreventDefaultCommand";
import ConfirmCommand from "wprr/commands/browser/ConfirmCommand";
import OptionsStepCommand from "wprr/commands/basic/OptionsStepCommand";
import GetValueCommand from "wprr/commands/basic/GetValueCommand";
import AddValueToArrayCommand from "wprr/commands/basic/AddValueToArrayCommand";
import ConsoleLogCommand from "wprr/commands/debug/ConsoleLogCommand";
import RemoveValueFromArrayCommand from "wprr/commands/basic/RemoveValueFromArrayCommand";

let callFunction = CallFunctionCommand.create;
let callFunctionName = CallFunctionCommand.createWithFunctionName;
export {callFunction, callFunctionName};

let getJson = LoadUrlCommand.createJsonGet;
let postJson = LoadUrlCommand.createJsonPost;
export {getJson, postJson};

let setValue = SetValueCommand.create;
let toggleValue = ToggleValueCommand.create;
let performSelectedCommands = PerformSelectedCommands.create;
let setStateValue = SetStateValueCommand.create;
let trigger = TriggerCommand.create;
let optionsStep = OptionsStepCommand.create;
let getValue = GetValueCommand.create;
let addValueToArray = AddValueToArrayCommand.create;
let removeValueFromArray = RemoveValueFromArrayCommand.create;

export {setValue, toggleValue, performSelectedCommands, setStateValue, trigger, optionsStep, getValue, addValueToArray, removeValueFromArray};

let reload = ReloadPageCommand.create;
let navigate = NavigationCommand.create;
let forceUpdate = ForceUpdateCommand.create;
let reactRouterNavigate = ReactRouterPushCommand.create;
let scrollTo = ScrollToCommand.create;
let submitForm = SubmitFormCommand.create;
let alert = AlertCommand.create;
let showOverlay = ShowOverlayCommand.create;
let closeCurrentOverlay = CloseCurrentOverlayCommand.create;
let confirm = ConfirmCommand.create;
let consoleLog = ConsoleLogCommand.create;
export {reload, navigate, forceUpdate, reactRouterNavigate, scrollTo, submitForm, alert, showOverlay, closeCurrentOverlay, confirm, consoleLog};

let preventDefault = PreventDefaultCommand.create;
let stopPropagation = StopPropagationCommand.create;
export {preventDefault, stopPropagation};

let injectReferences = InjectReferencesCommand.create;
export {injectReferences};

let animate = AnimateCommand.create;
let delay = DelayCommand.create;
export {animate, delay};