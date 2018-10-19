import CallFunctionCommand from "wprr/commands/basic/CallFunctionCommand";
import LoadUrlCommand from "wprr/commands/loading/LoadUrlCommand";
import SetValueCommand from "wprr/commands/basic/SetValueCommand";
import ToggleValueCommand from "wprr/commands/basic/ToggleValueCommand";
import PerformSelectedCommands from "wprr/commands/logic/PerformSelectedCommands";

let callFunction = CallFunctionCommand.create;
let callFunctionName = CallFunctionCommand.createWithFunctionName;
export {callFunction, callFunctionName};

let getJson = LoadUrlCommand.createJsonGet;
let postJson = LoadUrlCommand.createJsonPost;
export {getJson, postJson};

let setValue = SetValueCommand.create;
let toggleValue = ToggleValueCommand.create;
let performSelectedCommands = PerformSelectedCommands.create;

export {setValue, toggleValue, performSelectedCommands};