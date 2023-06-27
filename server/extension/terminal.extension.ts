import {lineArgs} from "../global/args";
import {openAppShell} from "./ext/terminal";

lineArgs.defineCommand( { name: ["shell"],  callback: openAppShell });
lineArgs.defineCommand( { name: ["terminal"],  callback: openAppShell });