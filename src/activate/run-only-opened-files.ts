import * as vscode from 'vscode'

import { bundleRspecOpenedFiles } from '../commands/opened-files'
import { clearTerminal } from '../commands/terminal'

export default function RegisterRunOnlyOpenedFiles() {
  return vscode.commands.registerCommand('extension.runAllOpenedFiles', () => {
    clearTerminal().then(() => bundleRspecOpenedFiles())
  })
}
