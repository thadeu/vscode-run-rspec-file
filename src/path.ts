import * as vscode from 'vscode'
import { getFilename, getRSpecFolder, getSuffixFile } from './utils'

export function getWorkspacePath(): string {
  const folderPaths: string[] = vscode.workspace.workspaceFolders.map((workspaceFolder) => workspaceFolder.uri.path)
  return folderPaths.find((path) => getFilename().includes(path))
}

export function getAsRelativePath(): string {
  const workspaceProjectPath: string = getWorkspacePath()
  const rootFile: string = getFilename().replace(workspaceProjectPath, '')
  const isApp: boolean = /^\/app\//.test(rootFile)
  const isSpec: boolean = /^\/spec\//.test(rootFile)
  const isLib: boolean = /^\/lib\//.test(rootFile)

  if (isApp) {
    const indexOfAppFolder: number = rootFile.indexOf('/app/')
    return rootFile.substring(indexOfAppFolder + 1)
  } else if (isSpec) {
    const indexOfSpecFolder: number = rootFile.indexOf('/spec/')
    return rootFile.substring(indexOfSpecFolder + 1)
  } else if (isLib) {
    const indexOfLibFolder: number = rootFile.indexOf('/lib/')
    return rootFile.substring(indexOfLibFolder + 1)
  }

  return ''
}

export function getFilePath(path?: string): string {
  let regex = /^(app\/)|(\.rb)|(_spec.rb)|(spec\/)/gi
  let value = (path || getAsRelativePath()).replace(regex, '')

  return value
}

export function getCurrentFilePath() {
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

export function getOriginalFile(): string {
  return getSpecFilePath()
    .replace(/spec\//g, '')
    .replace(/(_spec|_test)?.rb$/, '.rb')
}

export function getSpecFilePath(path?: string) {
  return `${getRSpecFolder()}/${getFilePath(path)}_${getSuffixFile()}.rb`
}

export function isSpecFolder() {
  return getFilename().indexOf('/spec/') !== -1
}

export function isLibFolder() {
  return getFilename().indexOf('/lib/') !== -1
}
