import { execCommand, getRSpecCommand } from './terminal'

export function bundleRspecAll() {
  return execCommand(getRSpecCommand())
}
