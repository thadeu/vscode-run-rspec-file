import * as vscode from "vscode";

import { bundleRspecAll } from "../commands/all-files";
import { clearTerminal } from "../commands/terminal";

export default function RegisterRunAllSpecs() {
  return vscode.commands.registerCommand("extension.runAllFilesOnRspec", () => {
    clearTerminal().then(() => bundleRspecAll());
  })
}