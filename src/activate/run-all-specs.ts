import * as vscode from 'vscode'

import { bundleRspecAll } from '../commands/all-files'
import { clearTerminal } from '../commands/terminal'

export default function RegisterRunAllSpecs() {
  return clearTerminal().then(() => bundleRspecAll())
}
