'use strict';

import * as vscode from 'vscode';

let terminals = {};
let TERMINAL_NAME = 'RSpec Run File';
let lastExecuted = '';

function getAsRelativePath(filename: string) {
    return vscode.workspace.asRelativePath(filename, false);
}

function getFilePath(filename: string) {
    return getAsRelativePath(filename.replace(/(app\/)|(.rb)|(_spec.rb)|(spec\/)/ig, ''));
}

function getSpecFilePath(filename: string) {    
    return `spec/${getFilePath(filename)}_spec.rb`
}

function getPrefixFolder(filename: string){
    return getAsRelativePath(filename).split('/')[0]
}

function isSpecFolder(filename: string) {
    return getPrefixFolder(filename) == 'spec';
}

function getTerminal() {
    let currentTerminal: vscode.Terminal = terminals[TERMINAL_NAME];

    if (!currentTerminal) {
        terminals[TERMINAL_NAME] = vscode.window.createTerminal(TERMINAL_NAME);
    }

    return terminals[TERMINAL_NAME];
}

function getFilename(){
    return vscode.window.activeTextEditor.document.fileName;
}

function getActiveLine(){
    return vscode.window.activeTextEditor.selection.active.line+1;
}

function execCommand(commandText: string){
    let terminal = getTerminal();
    
    terminal.sendText(commandText);
    terminal.show();

    lastExecuted = commandText;
}

function bundleRspecAll(){
    let commandText = `bundle exec rspec --color`
    execCommand(commandText)
}

function bundleRspecFile(){
    let specFilename = getSpecFilePath(getFilename());
    let commandText = `bundle exec rspec --color ${specFilename}`
    execCommand(commandText)
}

function bundleRspecLine(){
    let specFilename = getSpecFilePath(getFilename());
    let commandText = `bundle exec rspec --color ${specFilename}:${getActiveLine()}`
    execCommand(commandText)
}

function bundleRspecLastExecuted(){
    if (lastExecuted){
        execCommand(lastExecuted)
    }else {
        vscode.window.showWarningMessage('RSpec : Not found last command executed');
    }
}

function clearTerminal(){
    vscode.window.activeTextEditor.document.save();
    return vscode.commands.executeCommand('workbench.action.terminal.clear')
}

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.runOpenSpec', async () => {
        let uri = vscode.Uri.file(`${vscode.workspace.rootPath}/${getSpecFilePath(getFilename())}`)
        let success = await vscode.commands.executeCommand('vscode.open', uri);
    }));
    
    context.subscriptions.push(vscode.commands.registerCommand('extension.runAllFilesOnRspec', () => {
        clearTerminal().then(() => bundleRspecAll());
    }));
    
    context.subscriptions.push(vscode.commands.registerCommand('extension.runFileOnRspec', () => {
        clearTerminal().then(() => bundleRspecFile());
    }));
    
    context.subscriptions.push(vscode.commands.registerCommand('extension.runLineOnRspec', () => {
        clearTerminal().then(() => {
            if (isSpecFolder(getFilename())) {
                bundleRspecLine()
            }else {
                vscode.window.showWarningMessage('RSpec Line: only spec folder');
            }
        });
    }));
    
    context.subscriptions.push(vscode.commands.registerCommand('extension.runOnLastSpec', () => {
        clearTerminal().then(() => bundleRspecLastExecuted());
    }));
}

export function deactivate() {}

vscode.window.onDidCloseTerminal((terminal: vscode.Terminal) => {
    if (terminals[terminal.name]) {
        delete terminals[terminal.name];
    }
})