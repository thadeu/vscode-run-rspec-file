import * as vscode from "vscode";
import { SETTINGS_RSPEC_FOLDER, SETTINGS_SUFFIX_FILE } from "./contants";
import { getCurrentFilePath } from "./path";

export function getFilename() {
  return vscode.window.activeTextEditor.document.uri.path;
}

export function getActiveLine() {
  return vscode.window.activeTextEditor.selection.active.line + 1;
}

export function getRSpecFolder(): string {
  return vscode.workspace.getConfiguration().get(SETTINGS_RSPEC_FOLDER) || 'spec';
}

export function getSuffixFile(): string {
  return vscode.workspace.getConfiguration().get(SETTINGS_SUFFIX_FILE) || 'spec';
}

export async function toggleFile() {
  let uri = vscode.Uri.file(
    `${vscode.workspace.rootPath}/${getCurrentFilePath()}`
  );

  return vscode.commands.executeCommand("vscode.open", uri);
}