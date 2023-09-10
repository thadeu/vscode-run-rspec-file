import * as vscode from 'vscode'

let terminals = {}
let TERMINAL_NAME = 'RSpec Run File'
let lastExecuted = ''

const SETTINGS_RSPEC_COMMAND_KEY = 'vscode-run-rspec-file.custom-command'
const SETTINGS_RSPEC_FOLDER = 'vscode-run-rspec-file.folder'
const SETTINGS_SUFFIX_FILE = 'vscode-run-rspec-file.suffix'

function getWorkspacePath(): string {
  const folderPaths: string[] = vscode.workspace.workspaceFolders.map((workspaceFolder) => workspaceFolder.uri.path)
  return folderPaths.find((path) => getFilename().includes(path))
}

function getAsRelativePath(): string {
  const workspaceProjectPath: string = getWorkspacePath()
  const rootFile: string = getFilename().replace(workspaceProjectPath, '')
  const isApp: boolean = /^\/app\//.test(rootFile)
  const isSpec: boolean = /^\/spec\//.test(rootFile)
  const isLib: boolean = /^\/lib\//.test(rootFile)

  if (isApp) {
    const indexOfAppFolder: number = rootFile.indexOf('/app/')
    return rootFile.substr(indexOfAppFolder + 1)
  } else if (isSpec) {
    const indexOfSpecFolder: number = rootFile.indexOf('/spec/')
    return rootFile.substr(indexOfSpecFolder + 1)
  } else if (isLib) {
    const indexOfLibFolder: number = rootFile.indexOf('/lib/')
    return rootFile.substr(indexOfLibFolder + 1)
  }

  return ''
}

function getControllerSpecDirectory(): string {
  return vscode.workspace.getConfiguration().get("vscode-run-rspec-file.controller-spec-directory");
}

function getFilePath(path?: string): string {
  let regex = /^(app\/)|(\.rb)|(_spec.rb)|(spec\/)/gi
  let value = (path || getAsRelativePath()).replace(regex, '')

  // Check if the input file is in the "controllers" directory.
  if (value.startsWith("controllers/")) {
    // Replace "controllers" with the configured directory for controller specs.
    const controllerSpecDirectory = getControllerSpecDirectory();
    value = value.replace("controllers", controllerSpecDirectory);
  }

  return value;
}

function getCurrentFilePath() {
  let filepath = ''
  let filename = getOriginalFile()

  if (isSpecFolder()) {
    if (isLibFolder()) {
      filepath = filename
    } else {
      filepath = `app/${filename}`
    }
  } else {
    filepath = getSpecFilePath()
  }

  return filepath
}

function getOriginalFile(): string {
  return getSpecFilePath()
    .replace(/spec\//g, '')
    .replace(/(_spec|_test)?.rb$/, '.rb')
}

function getSpecFilePath(path?: string) {
  return `${getRSpecFolder()}/${getFilePath(path)}_${getSuffixFile()}.rb`
}

function isSpecFolder() {
  return getFilename().indexOf('/spec/') !== -1
}

function isLibFolder() {
  return getFilename().indexOf('/lib/') !== -1
}

function getTerminal() {
  let currentTerminal: vscode.Terminal = terminals[TERMINAL_NAME]

  if (!currentTerminal) {
    terminals[TERMINAL_NAME] = vscode.window.createTerminal(TERMINAL_NAME)
  }

  return terminals[TERMINAL_NAME]
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

function bundleRspecAll() {
  execCommand(getRSpecCommand())
}

function bundleRspecFile() {
  let specFilename = getSpecFilePath()
  let commandText = `${getRSpecCommand()} ${specFilename}`

  execCommand(commandText)
}

function bundleRspecLine() {
  let specFilename = getSpecFilePath()
  let commandText = `${getRSpecCommand()} ${specFilename}:${getActiveLine()}`
  execCommand(commandText)
}

function bundleRspecLastExecuted() {
  if (lastExecuted) {
    execCommand(lastExecuted)
  } else {
    vscode.window.showWarningMessage('RSpec : Not found last command executed')
  }
}

function bundleRspecOpenedFiles() {
  let documents = vscode.workspace.textDocuments
  const workspacePath: string = getWorkspacePath()

  let cache = {}

  let filePathsUri = documents.map((o) => {
    if (o.uri.path.endsWith('.rb')) {
      let file: string = o.uri.path.replace(workspacePath, '')

      if (file.startsWith('/')) {
        file = file.substring(1)
      }

      let uri = getSpecFilePath(file)
      cache[uri] = uri

      return uri
    }
  })

  filePathsUri = Object.keys(cache).filter((o) => !!o)

  if (filePathsUri.length <= 0) {
    return vscode.window.showInformationMessage('Not found opened spec files')
  }

  let specFilename = filePathsUri.join(' ')
  let commandText = `${getRSpecCommand()} ${specFilename}`

  execCommand(commandText)
}

function getRSpecCommand(): string {
  return vscode.workspace.getConfiguration().get(SETTINGS_RSPEC_COMMAND_KEY)
}

function getRSpecFolder(): string {
  return vscode.workspace.getConfiguration().get(SETTINGS_RSPEC_FOLDER) || 'spec'
}

function getSuffixFile(): string {
  return vscode.workspace.getConfiguration().get(SETTINGS_SUFFIX_FILE) || 'spec'
}

function clearTerminal() {
  vscode.window.activeTextEditor.document.save()
  return vscode.commands.executeCommand('workbench.action.terminal.clear')
}

function bundleRspecFolder() {
  vscode.window.showWarningMessage('RSpec: Run all files this folder!')
}

async function toggleFile() {
  let uri = vscode.Uri.file(`${vscode.workspace.rootPath}/${getCurrentFilePath()}`)

  return vscode.commands.executeCommand('vscode.open', uri)
}

export function activate(context: vscode.ExtensionContext) {
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
    vscode.commands.registerCommand('extension.runLineOnRspec', () => {
      clearTerminal().then(() => {
        if (isSpecFolder()) {
          bundleRspecLine()
        } else {
          vscode.window.showWarningMessage('RSpec Line: only spec folder')
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
