import * as vscode from 'vscode'
import get from 'lodash.get'

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

import FileObject from './FileObject'
import WorkSpace from './WorkSpace'

let settingsCache = {}
let globalsCache = {}

export let isMultipleWorkSpaces = () => vscode.workspace.workspaceFolders.length > 1

export function getWorkspace() {
  const uri = vscode.window.activeTextEditor.document.uri.path

  const workspace = new WorkSpace(uri)
  const project = workspace.toJSON()

  return {
    method: workspace,
    path: project.uri,
    name: project.name,
  }
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
  try {
    if (globalsCache[getWorkspace().name]) {
      return globalsCache[getWorkspace().name]
    }

    let config = vscode.workspace.getConfiguration()

    let customCommand = config.inspect('custom-command').defaultValue || config.inspect(SETTINGS_RSPEC_COMMAND_KEY).defaultValue

    let folder = config.inspect('folder').defaultValue || config.inspect(SETTINGS_RSPEC_FOLDER).defaultValue

    let controllerFolder = config.inspect('controller-spec-directory').defaultValue || config.inspect(SETTINGS_RSPEC_CONTROLLER_FOLDER).defaultValue

    let suffix = config.inspect('suffix').defaultValue || config.inspect(SETTINGS_SUFFIX_FILE).defaultValue

    let integration = config.inspect('integration').defaultValue || config.inspect(SETTINGS_INTEGRATION_TYPE).defaultValue

    let mapping = {
      ...SETTINGS_DEFAULT,
      customCommand,
      folder,
      suffix,
      controllerFolder,
      integration,
    }

    globalsCache[getWorkspace().name] = mapping

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
  if (settingsCache[getWorkspace().name]) {
    return getByKeyOrAll(settingsCache[getWorkspace().name], key)
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

    settingsCache[getWorkspace().name] = mapping

    return getByKeyOrAll(mapping, key)
  } catch (error) {
    console.error(error)

    return getByKeyOrAll(globals, key)
  }
}
