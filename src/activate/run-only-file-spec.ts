import { bundleRspecFile } from '../commands/one-file'
import { clearTerminal } from '../commands/terminal'

export default function RegisterRunFileSpec() {
  clearTerminal().then(() => bundleRspecFile())
}
