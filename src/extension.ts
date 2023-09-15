import * as vscode from 'vscode'
import get from 'lodash.get'

import FileObject from './FileObject'

import { getWorkspace, factorySettings, isMultipleWorkSpaces, getActiveLine, clearTerminal } from './Utils'

let terminals = {}
let lastExecuted = ''

function getTerminal(): vscode.Terminal {
  let workspace = getWorkspace()
  let name = [workspace.name, 'RSpec Run'].join(' - ')

  if (!isMultipleWorkSpaces()) {
    let opened = vscode.window.terminals.find((o) => o.name == name)

    if (opened) {
      return opened
    }

    return vscode.window.createTerminal({ name, cwd: workspace.path })
  }

  if (get(terminals, name)) {
    return get(terminals, name)
  }

  terminals[name] = vscode.window.createTerminal({ name, cwd: workspace.path })
  return get(terminals, name)
}

function execCommand(commandText: string) {
  let terminal = getTerminal()

  terminal.sendText(commandText)

  terminal.show(false)

  lastExecuted = commandText
}

async function bundleRspecAll() {
  let config = await factorySettings()

  return execCommand(config.customCommand)
}

async function bundleRspecFile(line?: any) {
  let config = await factorySettings()

  let workspace = getWorkspace()
  let file = workspace.method.fromFileUri(config)

  let commandText = `${config.customCommand} ${file.specPath}`

  if (line) {
    commandText = `${commandText}:${line}`
  }

  return execCommand(commandText)
}

function bundleRspecLastExecuted() {
  if (lastExecuted) {
    execCommand(lastExecuted)
  } else {
    vscode.window.showWarningMessage('RSpec : Not found last command executed')
  }
}

async function bundleRspecOpenedFiles() {
  let documents = vscode.workspace.textDocuments
  let workspace = getWorkspace()

  let cache = {}
  let filePathsUri = []
  let config = await factorySettings()

  for (let o of documents) {
    if (o.fileName.endsWith('.rb') && o.fileName.includes(workspace.path)) {
      let file: string = o.fileName.replace(workspace.path, '')

      if (file.startsWith('/')) {
        file = file.substring(1)
      }

      let fileObject = FileObject.fromRelativeUri(file, config)
      let uri = fileObject.specPath

      cache[uri] = uri
    }
  }

  filePathsUri = Object.keys(cache).filter((o) => !!o)

  if (filePathsUri.length <= 0) {
    return vscode.window.showInformationMessage('Not found opened spec files')
  }

  let specFilename = filePathsUri.join(' ')
  let commandText = `${config.customCommand} ${specFilename}`

  return execCommand(commandText)
}

async function toggleFile() {
  let config = await factorySettings()

  let workspace = getWorkspace()
  let file = workspace.method.fromFileUri(config)
  let uri = vscode.Uri.file(`${workspace.path}/${file.inversePath}`)

  return vscode.commands.executeCommand('vscode.open', uri)
}

export async function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(vscode.commands.registerCommand('extension.runOpenSpec', toggleFile))

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.runFileOnRspec', () => {
      clearTerminal().then(() => bundleRspecFile())
    }),
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.runAllFilesOnRspec', () => {
      clearTerminal().then(() => bundleRspecAll())
    }),
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.runAllOpenedFiles', () => {
      clearTerminal().then(() => bundleRspecOpenedFiles())
    }),
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.runLineOnRspec', async () => {
      clearTerminal().then(async () => {
        let line = getActiveLine()
        return bundleRspecFile(line)
      })
    }),
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.runOnLastSpec', () => {
      clearTerminal().then(() => bundleRspecLastExecuted())
    }),
  )
}

export function deactivate() {}

vscode.window.onDidCloseTerminal((terminal: vscode.Terminal) => {
  if (terminals[terminal.name]) {
    delete terminals[terminal.name]
  }
})
