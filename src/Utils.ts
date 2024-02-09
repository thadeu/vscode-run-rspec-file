import * as vscode from 'vscode'
import get from 'lodash.get'
import nodePath from 'path'

import {
  SettingsType,
  EXTENSION_NAME,
  SETTINGS_RSPEC_COMMAND_KEY,
  SETTINGS_RSPEC_FOLDER,
  SETTINGS_RSPEC_CONTROLLER_FOLDER,
  SETTINGS_SUFFIX_FILE,
  SETTINGS_INTEGRATION_TYPE,
  SETTINGS_DEFAULT,
} from './Constants'

import WorkSpace from './WorkSpace'

let settingsCache = {}
let globalsCache = {}

export let isMultipleWorkSpaces = () => vscode.workspace.workspaceFolders.length > 1

export const outputChannel = vscode.window.createOutputChannel('vscode-run-rspec-file')

export function log(...messages: any[]) {
  outputChannel.appendLine(messages.join(' '))
}

export function getWorkspace() {
  const uri = vscode.window.activeTextEditor.document.uri.path
  log('Utils[uri]', uri)

  const workspace = new WorkSpace(uri)
  const project = workspace.toJSON()

  return {
    method: workspace,
    path: project.uri,
    name: project.name,
  }
}

export function createTerminal(name: string, path: string) {
  let cwd = nodePath.isAbsolute(path) ? path : `/${path}`

  return vscode.window.createTerminal({ name, cwd })
}

export function getByKeyOrAll(object, key) {
  if (key) {
    return object[key]
  }

  return object
}

export function getActiveLine() {
  return vscode.window.activeTextEditor.selection.active.line + 1
}

export function clearTerminal() {
  vscode.window.activeTextEditor.document.save()

  return vscode.commands.executeCommand('workbench.action.terminal.clear')
}

export async function globalSettings(): Promise<SettingsType> {
  let workspaceName = getWorkspace().name

  try {
    if (globalsCache[workspaceName]) {
      return globalsCache[workspaceName]
    }

    function valueByKey(key: string, config: vscode.WorkspaceConfiguration) {
      const valueByGet = config.get(key)
      const valueByExtension = config.get(`${EXTENSION_NAME}.${key}`)
      const valueByInspect = config.inspect(`${EXTENSION_NAME}.${key}`)?.defaultValue

      return valueByGet || valueByExtension || valueByInspect
    }

    let config = vscode.workspace.getConfiguration(EXTENSION_NAME)

    let customCommand = valueByKey('custom-command', config)
    let folder = valueByKey('folder', config)
    let controllerFolder = valueByKey('controller-spec-directory', config)
    let suffix = valueByKey('suffix', config)
    let integration = valueByKey('integration', config)

    let mapping = {
      ...SETTINGS_DEFAULT,
      customCommand,
      folder,
      suffix,
      controllerFolder,
      integration,
    }

    globalsCache[workspaceName] = mapping

    return mapping
  } catch (error) {
    console.error(error)

    return SETTINGS_DEFAULT
  }
}

export async function localSettings(): Promise<SettingsType> {
  try {
    let workspace = getWorkspace()

    const files = await vscode.workspace.findFiles('**/.vscode/settings.json')
    const file = files.find((o) => String(o.path).includes(workspace.path))

    if (!file) {
      return null
    }

    const buffer = await vscode.workspace.fs.readFile(vscode.Uri.parse(file.fsPath))
    const data = JSON.parse(buffer.toString())

    return data
  } catch (error) {
    console.error(error)

    vscode.window.showErrorMessage('RSpec Extension: parse settings.json failed')

    return null
  }
}

export async function factorySettings(key?: keyof SettingsType) {
  let workspaceName = getWorkspace().name

  if (settingsCache[workspaceName]) {
    return getByKeyOrAll(settingsCache[workspaceName], key)
  }

  const globals = await globalSettings()

  try {
    const local = await localSettings()

    let mapping = {
      customCommand: get(local, SETTINGS_RSPEC_COMMAND_KEY) || globals['customCommand'],
      folder: get(local, SETTINGS_RSPEC_FOLDER) || globals['folder'],
      controllerFolder: get(local, SETTINGS_RSPEC_CONTROLLER_FOLDER) || globals['controllerFolder'],
      suffix: get(local, SETTINGS_SUFFIX_FILE) || globals['suffix'],
      integration: get(local, SETTINGS_INTEGRATION_TYPE) || globals['integration'],
    }

    settingsCache[workspaceName] = mapping

    return getByKeyOrAll(mapping, key)
  } catch (error) {
    console.error(error)

    return getByKeyOrAll(globals, key)
  }
}
