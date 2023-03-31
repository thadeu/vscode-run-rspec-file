import * as vscode from 'vscode'

import { execCommand } from './terminal'

export function bundleRspecLastExecuted(lastExecuted) {
  if (lastExecuted) {
    return execCommand(lastExecuted)
  }

  return vscode.window.showWarningMessage('RSpec : Not found last command executed')
}
