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

export {setValue, toggleValue, performSelectedCommands, setStateValue, trigger};

let reload = ReloadPageCommand.create;
let navigate = NavigationCommand.create;
let forceUpdate = ForceUpdateCommand.create;
let reactRouterNavigate = ReactRouterPushCommand.create;
export {reload, navigate, forceUpdate, reactRouterNavigate};

let injectReferences = InjectReferencesCommand.create;
export {injectReferences};