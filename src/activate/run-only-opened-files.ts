import { bundleRspecOpenedFiles } from '../commands/opened-files'
import { clearTerminal } from '../commands/terminal'

export default function RegisterRunOnlyOpenedFiles() {
  clearTerminal().then(() => bundleRspecOpenedFiles())
}
