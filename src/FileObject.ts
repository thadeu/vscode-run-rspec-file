import path from 'node:path'
import compact from 'lodash.compact'
import get from 'lodash.get'

export type FileObjectType = {
  namespace?: string
  name?: string
  suffix?: string
  ext?: string
  path?: string | any
  inversePath?: string
  specPath?: string
  isExpectation?: boolean
  isRailsApp?: boolean
  isLibrary?: boolean
  isDevContainer?: boolean
  controllerFolder?: string
}

export default class FileObject {
  filepath: string
  workspace: any

  config: {
    suffix: string
    folder: string
    integration: string
    controllerFolder: string
  }

  constructor(filepath?: string, config = {}, workspace = {}) {
    this.filepath = filepath
    this.workspace = workspace

    this.config = {
      suffix: 'spec',
      folder: 'spec',
      integration: 'rails',
      controllerFolder: 'controllers',
      ...(config || {}),
    }
  }

  static fromRelativeUri(filepath?: string, config?: any, workspace?: {}): FileObjectType {
    return new FileObject(filepath, config, workspace).toJSON()
  }

  controllerFolderOrDefault() {
    return get(this.config, 'controllerFolder', 'controllers')
  }

  isExpectation = (text: string) => /(spec|test)$/.test(String(text).replace(/\.rb/, ''))

  isLibrary = (text: string) => /lib/.test(text)

  isRailsApp = () => this.config?.integration == 'rails'

  isDevContainer = () => this.config?.integration == 'devcontainer' || this.workspace.remoteName == 'dev-container'

  // Strategy?
  specPath(rawpath) {
    // prettier-ignore
    let filepath = rawpath
      .replace(this.workspace.uri, '')
      .split(path.sep)
      .filter(Boolean)
      .join('/')

    if (filepath.match(/_(spec.rb|test.rb)$/)) {
      return filepath
    }

    const { folder, suffix } = this.config
    const tree = compact(filepath.split(path.sep))
    const fileFolder = tree[0]
    const subtree = tree.slice(1)

    function hydrate(str: string, suffix: string): string {
      let newstr = str.replace(/\.rb$/, '')
      return `${newstr}_${suffix}.rb`
    }

    if (fileFolder == 'lib') {
      const file = hydrate(tree.join('/'), suffix)
      return `${folder}/${file}`
    }

    if (fileFolder == 'app') {
      let file = hydrate(subtree.join('/'), suffix)
      file = file.replace('controllers', this.controllerFolderOrDefault())

      return `${folder}/${file}`
    }

    return filepath
  }

  inversePath(rawpath: string) {
    // prettier-ignore
    let filepath = rawpath
      .replace(this.workspace.uri, '')
      .split(path.sep)
      .filter(Boolean)
      .join('/');

    function hydrate(str: string): string {
      let newstr = str.replace(/_(spec|test)\.rb$/, '')
      return `${newstr}.rb`
    }

    // Question: we're in the lib folder?
    if (filepath.match(/^lib\//)) {
      let inversed = this.specPath(rawpath)
      return inversed
    }

    // Question: we're in the app folder?
    if (filepath.match(/\/?^app\//)) {
      let inversed = this.specPath(rawpath)
      return inversed
    }

    // Question: we're in the spec folder?
    if (filepath.match(/_(spec\.rb|test\.rb)$/)) {
      let newstr = filepath.split('/').slice(1).join('/')
      let inversed = hydrate(newstr)

      if (inversed.match(/^controllers/)) {
        inversed = inversed.replace('controllers', this.controllerFolderOrDefault())
      }

      if (inversed.match(/^requests/)) {
        inversed = inversed.replace('requests', 'controllers')
      }

      if (this.isRailsApp() && !inversed.match(/^(lib|spec|test)\//)) {
        return `app/${inversed}`
      }

      return inversed
    }

    return filepath
  }

  toJSON(): FileObjectType {
    let parts = compact(this.filepath.replace(this.workspace.uri, '').split(path.sep))

    let namespace = parts[0]
    let name = parts.slice(1).join('/')

    let ext = name.match(/(?<ext>\.rb)$/)?.groups?.ext
    let suffix = name.match(/(\w+_)(?<suffix>spec|test)\.rb$/)?.groups?.suffix
    let filepath = [namespace, name].join('/')

    if (this.isLibrary(namespace)) {
      name = parts.join('/')
    }

    let result = {
      namespace,
      name,
      suffix,
      ext,
      path: filepath,
      isExpectation: this.isExpectation(suffix),
      isLibrary: this.isLibrary(namespace),
      isRailsApp: this.isRailsApp(),
      isDevContainer: this.isDevContainer(),
      specPath: this.specPath(this.filepath),
      inversePath: this.inversePath(this.filepath),
    }

    return result
  }
}
