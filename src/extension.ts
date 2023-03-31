import * as vscode from 'vscode'

import { clearTerminal, getTerminal } from './commands/terminal'

import RegisterToggleFile from './activate/toggle-file'
import RegisterRunOnlyOpenedFiles from './activate/run-only-opened-files'
import RegisterRunAllSpecs from './activate/run-all-specs'
import RegisterRunOnlyFileSpec from './activate/run-only-file-spec'
import RegisterRunLineFileSpec from './activate/run-line-file-spec'
import { bundleRspecLastExecuted } from './commands/last-executed'

let terminals = {}
let lastExecuted = ''

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(vscode.commands.registerCommand('extension.runAllFilesOnRspec', RegisterRunAllSpecs))
  context.subscriptions.push(vscode.commands.registerCommand('extension.runFileOnRspec', RegisterRunOnlyFileSpec))
  context.subscriptions.push(vscode.commands.registerCommand('extension.runOpenSpec', RegisterToggleFile))
  context.subscriptions.push(vscode.commands.registerCommand('extension.runLineOnRspec', RegisterRunLineFileSpec))
  context.subscriptions.push(vscode.commands.registerCommand('extension.runAllOpenedFiles', RegisterRunOnlyOpenedFiles))

  // Because lastExecuted variable will be pass to command
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.runOnLastSpec', () => {
      clearTerminal().then(() => bundleRspecLastExecuted(lastExecuted))
    }),
  )
}

export function deactivate() {}

export function execCommand(commandText: string) {
  let terminal = getTerminal(terminals)

  terminal.sendText(commandText)
  terminal.show()

  lastExecuted = commandText

  return lastExecuted
}

vscode.window.onDidCloseTerminal((terminal: vscode.Terminal) => {
  if (terminals[terminal.name]) {
    delete terminals[terminal.name]
  }
})
