import { getSpecFilePath } from '../path'
import { execCommand, getRSpecCommand } from './terminal'

export function bundleRspecFile() {
  let specFilename = getSpecFilePath()
  let commandText = `${getRSpecCommand()} ${specFilename}`

  return execCommand(commandText)
}
