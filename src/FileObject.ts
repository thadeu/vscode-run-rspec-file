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
  isRailsApp?: boolean
  controllerFolder?: string
}

export default class FileObject {
  filepath: string

  config: {
    suffix: string
    folder: string
    integration: string
    controllerFolder: string
  }

  constructor(filepath?: string, config = {}) {
    this.filepath = filepath

    this.config = {
      suffix: 'spec',
      folder: 'spec',
      integration: 'rails',
      controllerFolder: 'controllers',
      ...(config || {}),
    }
  }

  static fromRelativeUri(filepath?: string, config?: any): FileObjectType {
    return new FileObject(filepath, config).toJSON()
  }

  controllerFolderOrDefault() {
    return get(this.config, 'controllerFolder', 'controllers')
  }

  isExpectation = (text: string) => /^(spec|test)/.test(text)

  isLibrary = (text: string) => /lib/.test(text)

  isRailsApp = () => this.config?.integration == 'rails'

  isDevContainer = () => this.config?.integration == 'devcontainer'

  toJSON(): FileObjectType {
    let parts = compact(this.filepath.split(path.sep))

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
      inversePath: '',
      specPath: '',
      isRailsApp: this.isRailsApp(),
      isDevContainer: this.isDevContainer(),
    }

    if (this.isExpectation(suffix)) {
      let nameWithoutSuffix = name.replace(new RegExp(`_${suffix}`), '')

      if (this.isLibrary(filepath)) {
        result.inversePath = ['lib', nameWithoutSuffix].join('/').replace(/^(lib\/)(lib)/, '$2')
      } else {
        nameWithoutSuffix = nameWithoutSuffix.replace('requests', 'controllers').replace(/^spec\//, '')
        result.inversePath = ['app', nameWithoutSuffix].join('/')
      }
    } else {
      let nameByMode = this.isRailsApp() ? name : filepath
      nameByMode = this.isDevContainer() ? filepath : name

      if (this.isDevContainer()) {
        nameByMode = nameByMode.replace(/^app\//, '')
      }

      let nameWithSuffix = nameByMode
        .replace('controllers', this.controllerFolderOrDefault())
        .replace('.rb', `_${this.config?.suffix || 'spec'}.rb`)

      result.inversePath = compact([this.config?.folder, nameWithSuffix]).join('/')
    }

    result.specPath = this.isExpectation(suffix) ? result.path : result.inversePath

    return result
  }
}
