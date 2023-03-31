import * as vscode from 'vscode'
import compact from 'lodash.compact'
import uniq from 'lodash.uniq'

import { execCommand } from '../extension'
import { getRSpecCommand } from './terminal'
import { getSpecFilePath, getWorkspacePath } from '../path'

function notifyWindow(size: number) {
  return vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `RSpec: Running ${size} opened files`,
      cancellable: true,
    },
    (progress, token) => {
      progress.report({ increment: 0 })

      const delay = new Promise<void>((resolve) => {
        setTimeout(() => {
          progress.report({ increment: 100 })

          resolve()
        }, 3500)
      })

      return delay
    },
  )
}

function warningWindow(message: string) {
  return vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: message,
      cancellable: true,
    },
    (progress, token) => {
      progress.report({ increment: 0 })

      const delay = new Promise<void>((resolve) => {
        setTimeout(() => {
          progress.report({ increment: 100 })

          resolve()
        }, 3500)
      })

      return delay
    },
  )
}

export function bundleRspecOpenedFiles() {
  let documents = vscode.workspace.textDocuments
  const workspacePath: string = getWorkspacePath()

  let filePathsUri = documents.map((o) => {
    if (o.uri.path.endsWith('.rb')) {
      let file: string = o.uri.path.replace(workspacePath, '')

      if (file.startsWith('/')) {
        file = file.substring(1)
      }

      return getSpecFilePath(file)
    }
  })

  filePathsUri = uniq(compact(filePathsUri))

  if (filePathsUri.length <= 0) {
    return warningWindow('RSpec: Not found opened specs, try open spec before')
  }

  let specFilename = filePathsUri.join(' ')
  let commandText = `${getRSpecCommand()} ${specFilename}`

  notifyWindow(filePathsUri.length)
  execCommand(commandText)
}
