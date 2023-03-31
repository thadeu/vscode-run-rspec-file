import { execCommand } from '../extension'
import { getRSpecCommand } from './terminal'

export function bundleRspecAll() {
  return execCommand(getRSpecCommand())
}
