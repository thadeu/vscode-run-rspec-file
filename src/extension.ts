import * as vscode from 'vscode'
import { readFile } from 'fs/promises'
import get from 'lodash.get'

type SettingsType = {
  customCommand?: any
  folder?: any
  suffix?: any
  controllerFolder?: any
}

let terminals = {}
let settingsCache = {}
let globalsCache = {}
let lastExecuted = ''

const EXTENSION_NAME = 'vscode-run-rspec-file'
const SETTINGS_RSPEC_COMMAND_KEY = `${EXTENSION_NAME}.custom-command`
const SETTINGS_RSPEC_FOLDER = `${EXTENSION_NAME}.folder`
const SETTINGS_RSPEC_CONTROLLER_FOLDER = `${EXTENSION_NAME}.controller-spec-directory`
const SETTINGS_SUFFIX_FILE = `${EXTENSION_NAME}.suffix`

let isMultipleWorkSpaces = () => vscode.workspace.workspaceFolders.length > 1
const settingDefaultObject: SettingsType = {
  customCommand: 'bundle exec rspec',
  folder: 'spec',
  suffix: 'spec',
  controllerFolder: 'controllers',
}

function getByKeyOrAll(object, key) {
  if (key) {
    return object[key]
  }

  return object
}

async function globalSettings(): Promise<SettingsType> {
  try {
    if (globalsCache[getWorkspace().name]) {
      return globalsCache[getWorkspace().name]
    }

    let config = vscode.workspace.getConfiguration()

    let customCommand = config.inspect('custom-command').defaultValue || config.inspect(SETTINGS_RSPEC_COMMAND_KEY).defaultValue

    let folder = config.inspect('folder').defaultValue || config.inspect(SETTINGS_RSPEC_FOLDER).defaultValue

    let controllerFolder = config.inspect('controller-spec-directory').defaultValue || config.inspect(SETTINGS_RSPEC_CONTROLLER_FOLDER).defaultValue

    let suffix = config.inspect('suffix').defaultValue || config.inspect(SETTINGS_SUFFIX_FILE).defaultValue

    let mapping = {
      ...settingDefaultObject,
      customCommand,
      folder,
      suffix,
      controllerFolder,
    }

    globalsCache[getWorkspace().name] = mapping

    return mapping
  } catch (error) {
    console.error(error)

    return settingDefaultObject
  }
}

async function localSettings(): Promise<SettingsType> {
  try {
    const uri = vscode.window.activeTextEditor.document.uri
    const workspace = vscode.workspace.getWorkspaceFolder(uri)

    const files = await vscode.workspace.findFiles('**/.vscode/settings.json')
    const file = files.find((o) => String(o.path).includes(workspace.uri.path))

    const data = JSON.parse(await readFile(file.fsPath, 'utf8'))

    return data
  } catch (error) {
    console.error(error)
    vscode.window.showWarningMessage('RSpec Extension: parse settings.json failed')

    return null
  }
}

async function factorySettings(key?: keyof SettingsType) {
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
    }

    settingsCache[getWorkspace().name] = mapping

    return getByKeyOrAll(mapping, key)
  } catch (error) {
    console.error(error)

    return getByKeyOrAll(globals, key)
  }
}

function getWorkspace(key?: string): vscode.WorkspaceFolder {
  let workspace = vscode.workspace.getWorkspaceFolder(vscode.window.activeTextEditor.document.uri)

  return workspace
}

function getWorkspacePath(): string {
  let workspace = getWorkspace()

  return workspace.uri.path
}

async function getAsRelativePath() {
  const workspaceProjectPath: string = getWorkspacePath()
  const rootFile: string = getFilename().replace(workspaceProjectPath, '')
  const folder = await getRSpecFolder()

  const isApp: boolean = /^\/app\//.test(rootFile)
  const isSpec: boolean = new RegExp(`^\/?${folder}\/`).test(rootFile)
  const isLib: boolean = /^\/lib\//.test(rootFile)

  if (isApp) {
    const indexOfAppFolder: number = rootFile.indexOf('/app/')
    return rootFile.substr(indexOfAppFolder + 1)
  } else if (isSpec) {
    const indexOfSpecFolder: number = rootFile.indexOf(`/${folder}/`)
    return rootFile.substr(indexOfSpecFolder + 1)
  } else if (isLib) {
    const indexOfLibFolder: number = rootFile.indexOf('/lib/')
    return rootFile.substr(indexOfLibFolder + 1)
  }

  return ''
}

async function getControllerSpecDirectory() {
  let config = await factorySettings('controllerFolder')
  return config
}

async function getFilePath(path?: string) {
  let [folder, suffix, relativePath] = await Promise.all([getRSpecFolder(), getSuffixFile(), getAsRelativePath()])

  let regex = new RegExp(`^(app\/)|(\.rb)|(_${suffix}.rb)|(${folder}\/)`, 'g')
  let value = (path || relativePath).replace(regex, '')

  if (value.startsWith('controllers/')) {
    const controllerSpecDirectory = await getControllerSpecDirectory()
    value = value.replace('controllers', controllerSpecDirectory)
  }

  return value
}

async function getCurrentFilePath() {
  let filepath = ''

  let file = await getOriginalFile()
  let filename = file.replace(new RegExp(`^${getRSpecFolder()}/`), '')

  if (await isSpecFolder()) {
    if (isLibFolder()) {
      filepath = filename
    } else {
      filepath = `app/${filename}`
    }
  } else {
    filepath = await getSpecFilePath()
  }

  return filepath
}

async function getOriginalFile() {
  return (await getSpecFilePath()).replace(/spec\//g, '').replace(/(_spec|_test)?.rb$/, '.rb')
}

async function getSpecFilePath(path?: string) {
  let [filepath, suffix, folder] = await Promise.all([getFilePath(path), getSuffixFile(), getRSpecFolder()])

  let file = [filepath]

  if (suffix) {
    file = [file, '_', suffix]
  }

  file.push('.rb')

  let parts = [folder, file.join('')]

  return parts.join('/')
}

async function isSpecFolder() {
  let folder = await getRSpecFolder()
  let regex = new RegExp(`\/${folder}\/`)

  return regex.test(getFilename())
}

function isLibFolder() {
  let regex = /\/lib\//
  return regex.test(getFilename())
}

function getTerminal(): vscode.Terminal {
  let workspaceName = getWorkspace().name
  let name = [workspaceName, 'RSpec Run'].join(' - ')

  if (!isMultipleWorkSpaces()) {
    let opened = vscode.window.terminals.find((o) => o.name == name)

    if (opened) {
      return opened
    }

    return vscode.window.createTerminal(name)
  }

  if (get(terminals, name)) {
    return get(terminals, name)
  }

  terminals[name] = vscode.window.createTerminal(name)
  return get(terminals, name)
}

function getFilename() {
  return vscode.window.activeTextEditor.document.uri.path
}

function getActiveLine() {
  return vscode.window.activeTextEditor.selection.active.line + 1
}

function execCommand(commandText: string) {
  let terminal = getTerminal()

  terminal.sendText(commandText)
  terminal.show()

  lastExecuted = commandText
}

async function bundleRspecAll() {
  execCommand(await getRSpecCommand())
}

async function bundleRspecFile() {
  let filename = await getSpecFilePath()
  let command = await getRSpecCommand()
  let commandText = `${command} ${filename}`

  return execCommand(commandText)
}

async function bundleRspecLine() {
  let filename = await getSpecFilePath()
  let command = await getRSpecCommand()
  let line = await getActiveLine()
  let commandText = `${command} ${filename}:${line}`

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
  const workspacePath: string = getWorkspacePath()

  let cache = {}
  let filePathsUri = []

  for (let o of documents) {
    if (o.fileName.endsWith('.rb') && o.fileName.includes(workspacePath)) {
      let file: string = o.fileName.replace(workspacePath, '')

      if (file.startsWith('/')) {
        file = file.substring(1)
      }

      let uri = await getSpecFilePath(file)
      cache[uri] = uri
    }
  }

  filePathsUri = Object.keys(cache).filter((o) => !!o)

  if (filePathsUri.length <= 0) {
    return vscode.window.showInformationMessage('Not found opened spec files')
  }

  let specFilename = filePathsUri.join(' ')
  let commandText = `${await getRSpecCommand()} ${specFilename}`

  return execCommand(commandText)
}

async function getRSpecCommand() {
  const config = await factorySettings('customCommand')

  return config
}

async function getRSpecFolder() {
  const config = await factorySettings('folder')

  return config
}

async function getSuffixFile() {
  const config = await factorySettings('suffix')

  return config
}

function clearTerminal() {
  vscode.window.activeTextEditor.document.save()
  return vscode.commands.executeCommand('workbench.action.terminal.clear')
}

function bundleRspecFolder() {
  vscode.window.showWarningMessage('RSpec: Run all files this folder!')
}

async function toggleFile() {
  const filepath = await getCurrentFilePath()
  const workspaceName = getWorkspace().name

  function getRootPath() {
    if (isMultipleWorkSpaces()) {
      const folders = vscode.workspace.workspaceFolders.map((o) => o.uri.fsPath)
      const target = folders.find((o) => o.includes(workspaceName))

      return target
    } else {
      return vscode.workspace.rootPath
    }
  }

  let uri = vscode.Uri.file(`${getRootPath()}/${filepath}`)
  return vscode.commands.executeCommand('vscode.open', uri)
}

export async function activate(context: vscode.ExtensionContext) {
  let settings = await globalSettings()
  context.globalState.update('globalSettings', settings)

  context.subscriptions.push(vscode.commands.registerCommand('extension.runOpenSpec', toggleFile))

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.runAllFilesFolder', () => {
      clearTerminal().then(() => bundleRspecFolder())
    }),
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.runAllOpenedFiles', () => {
      clearTerminal().then(() => bundleRspecOpenedFiles())
    }),
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.runAllFilesOnRspec', () => {
      clearTerminal().then(() => bundleRspecAll())
    }),
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.runFileOnRspec', () => {
      clearTerminal().then(() => bundleRspecFile())
    }),
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.runLineOnRspec', async () => {
      clearTerminal().then(async () => {
        if (await isSpecFolder()) {
          await bundleRspecLine()
        } else {
          let folder = await getRSpecFolder()
          vscode.window.showWarningMessage(`RSpec one Line: works only ${folder} folder configured. Check .vscode/settings.json file`)
        }
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
