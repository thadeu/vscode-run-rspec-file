import * as vscode from "vscode";

import { toggleFile } from "../utils";

export default function RegisterToggleFile() {
  return vscode.commands.registerCommand("extension.runOpenSpec", toggleFile)
}