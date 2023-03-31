import { execCommand } from '../extension'
import { getSpecFilePath } from '../path'
import { getActiveLine } from '../utils'
import { getRSpecCommand } from './terminal'

export function bundleRspecLine() {
  let specFilename = getSpecFilePath()
  let commandText = `${getRSpecCommand()} ${specFilename}:${getActiveLine()}`

  return execCommand(commandText)
}
