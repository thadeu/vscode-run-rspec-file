import { execCommand } from '../extension'
import { getSpecFilePath } from '../path'
import { getRSpecCommand } from './terminal'

export function bundleRspecFile() {
  let specFilename = getSpecFilePath()
  let commandText = `${getRSpecCommand()} ${specFilename}`

  return execCommand(commandText)
}
