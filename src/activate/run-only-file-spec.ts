import * as vscode from "vscode";

import { bundleRspecFile } from "../commands/one-file";
import { clearTerminal } from "../commands/terminal";

export default function RegisterRunFileSpec() {
  return vscode.commands.registerCommand("extension.runFileOnRspec", () => {
    clearTerminal().then(() => bundleRspecFile());
  })
}