import * as vscode from 'vscode'

import { bundleRspecLine } from '../commands/one-line'
import { clearTerminal } from '../commands/terminal'
import { isSpecFolder } from '../path'

export default function RegisterRunLineFileSpec() {
  return vscode.commands.registerCommand('extension.runLineOnRspec', () => {
    clearTerminal().then(() => {
      if (isSpecFolder()) {
        bundleRspecLine()
      } else {
        vscode.window.showWarningMessage('RSpec Line: only spec folder')
      }
    })
  })
}
