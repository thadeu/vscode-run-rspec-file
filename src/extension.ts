import * as vscode from "vscode";

let terminals = {};
let TERMINAL_NAME = "RSpec Run File";
let lastExecuted = "";

const SETTINGS_RSPEC_COMMAND_KEY = "vscode-run-rspec-file.custom-command";

function getWorkspacePath(): string {
  const folderPaths = vscode.workspace.workspaceFolders.map(workspaceFolder => workspaceFolder.uri.path);
  return folderPaths.find(path => getFilename().includes(path));
}

function getAsRelativePath(): string {
  const workspaceProjectPath: string = getWorkspacePath();
  const rootFile: string = getFilename().replace(workspaceProjectPath, "");
  const isApp: boolean = /^\/app\//.test(rootFile);
  const isSpec: boolean = /^\/spec\//.test(rootFile);
  const isLib: boolean = /^\/lib\//.test(rootFile);

  if (isApp) {
    const indexOfAppFolder: number = rootFile.indexOf("/app/");
    return rootFile.substr(indexOfAppFolder + 1);
  } else if (isSpec) {
    const indexOfSpecFolder: number = rootFile.indexOf("/spec/");
    return rootFile.substr(indexOfSpecFolder + 1);
  } else if (isLib) {
    const indexOfLibFolder: number = rootFile.indexOf("/lib/");
    return rootFile.substr(indexOfLibFolder + 1);
  }

  return "";
}

function getFilePath(): string {
  return getAsRelativePath().replace(
    /^(app\/)|(.rb)|(_spec.rb)|(spec\/)/gi,
    ""
  );
}

function getCurrentFilePath() {
  let filepath = "";
  let filename = getOriginalFile();

  if (isSpecFolder()) {
    if (isLibFolder()) {
      filepath = filename;
    } else {
      filepath = `app/${filename}`;
    }
  } else {
    filepath = getSpecFilePath();
  }

  return filepath;
}

function getOriginalFile(): string {
  return getSpecFilePath().replace(/spec\/|(_spec)/g, "");
}

function getSpecFilePath() {
  return `spec/${getFilePath()}_spec.rb`;
}

function isSpecFolder() {
  return getFilename().indexOf("/spec/") !== -1;
}

function isLibFolder() {
  return getFilename().indexOf("/lib/") !== -1;
}

function getTerminal() {
  let currentTerminal: vscode.Terminal = terminals[TERMINAL_NAME];

  if (!currentTerminal) {
    terminals[TERMINAL_NAME] = vscode.window.createTerminal(TERMINAL_NAME);
  }

  return terminals[TERMINAL_NAME];
}

function getFilename() {
  return vscode.window.activeTextEditor.document.uri.path;
}

function getActiveLine() {
  return vscode.window.activeTextEditor.selection.active.line + 1;
}

function execCommand(commandText: string) {
  let terminal = getTerminal();

  terminal.sendText(commandText);
  terminal.show();

  lastExecuted = commandText;
}

function bundleRspecAll() {
  execCommand(getRSpecCommand());
}

function bundleRspecFile() {
  let specFilename = getSpecFilePath();
  let commandText = `${getRSpecCommand()} ${specFilename}`;

  execCommand(commandText);
}

function bundleRspecLine() {
  let specFilename = getSpecFilePath();
  let commandText = `${getRSpecCommand()} ${specFilename}:${getActiveLine()}`;
  execCommand(commandText);
}

function bundleRspecLastExecuted() {
  if (lastExecuted) {
    execCommand(lastExecuted);
  } else {
    vscode.window.showWarningMessage("RSpec : Not found last command executed");
  }
}

function getRSpecCommand(): string {
  return vscode.workspace.getConfiguration().get(SETTINGS_RSPEC_COMMAND_KEY);
}

function clearTerminal() {
  vscode.window.activeTextEditor.document.save();
  return vscode.commands.executeCommand("workbench.action.terminal.clear");
}

function bundleRspecFolder() {
  vscode.window.showWarningMessage("RSpec: Run all files this folder");
}

async function toggleFile() {
  let uri = vscode.Uri.file(
    `${vscode.workspace.rootPath}/${getCurrentFilePath()}`
  );

  await vscode.commands.executeCommand("vscode.open", uri);
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.runOpenSpec", toggleFile)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("extension.runAllFilesFolder", () => {
      clearTerminal().then(() => bundleRspecFolder());
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("extension.runAllFilesOnRspec", () => {
      clearTerminal().then(() => bundleRspecAll());
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("extension.runFileOnRspec", () => {
      clearTerminal().then(() => bundleRspecFile());
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("extension.runLineOnRspec", () => {
      clearTerminal().then(() => {
        if (isSpecFolder()) {
          bundleRspecLine();
        } else {
          vscode.window.showWarningMessage("RSpec Line: only spec folder");
        }
      });
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("extension.runOnLastSpec", () => {
      clearTerminal().then(() => bundleRspecLastExecuted());
    })
  );
}

export function deactivate() {}

vscode.window.onDidCloseTerminal((terminal: vscode.Terminal) => {
  if (terminals[terminal.name]) {
    delete terminals[terminal.name];
  }
});
