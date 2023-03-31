import * as vscode from 'vscode'
import { SETTINGS_RSPEC_COMMAND_KEY, TERMINAL_NAME } from '../contants'

export function getRSpecCommand(): string {
  return vscode.workspace.getConfiguration().get(SETTINGS_RSPEC_COMMAND_KEY)
}

export function clearTerminal() {
  vscode.window.activeTextEditor.document.save()

  return vscode.commands.executeCommand('workbench.action.terminal.clear')
}

export function getTerminal(terminals) {
  let currentTerminal: vscode.Terminal = terminals[TERMINAL_NAME]

  if (!currentTerminal) {
    terminals[TERMINAL_NAME] = vscode.window.createTerminal(TERMINAL_NAME)
  }

  return terminals[TERMINAL_NAME]
}

export function execCommand(commandText: string, terminals = {}, lastExecuted = '') {
  let terminal = getTerminal(terminals)

  terminal.sendText(commandText)
  terminal.show()

  lastExecuted = commandText

  return lastExecuted
}
