import * as vscode from "vscode";

import { bundleRspecLastExecuted } from "../commands/last-executed";
import { clearTerminal } from "../commands/terminal";

export default function RegisterRunLastSpec(lastExecuted) {
  return vscode.commands.registerCommand("extension.runOnLastSpec", () => {
    clearTerminal().then(() => bundleRspecLastExecuted(lastExecuted));
  })
}