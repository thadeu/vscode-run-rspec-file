import * as vscode from 'vscode'
import path from 'node:path'

import FileObject from './FileObject'

export default class WorkSpace {
  name: string
  rootUri: string
  fileUri: string
  originalUri: string

  constructor(fileUri: string) {
    this.fileUri = fileUri
    this.rootUri = ''

    for (let workspace of vscode.workspace.workspaceFolders) {
      let parts = this.fileUri.split(path.sep).filter(Boolean)
      let index = parts.findIndex((o) => o === workspace.name)

      if (index >= 0) {
        this.rootUri = ['', ...parts.slice(0, index + 1)].join('/')
      }
    }
  }

  toJSON() {
    this.originalUri = this.rootUri
    this.name = this.rootUri.split(path.sep).slice(-1)[0]

    return {
      uri: this.originalUri,
      name: this.name,
      remoteName: vscode.env.remoteName,
    }
  }

  fromFileUri(config?: any) {
    let fileUri = this.fileUri

    fileUri = fileUri.replace(this.originalUri, '')
    fileUri = fileUri.replace(/^\/?\/?/, '')

    return FileObject.fromRelativeUri(fileUri, config, this.toJSON())
  }
}
