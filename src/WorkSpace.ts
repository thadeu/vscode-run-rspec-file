import path from 'node:path'
import compact from 'lodash.compact'
import isEmpty from 'lodash.isempty'

import FileObject from './FileObject'

export default class WorkSpace {
  name: string
  fileUri: string
  uri: string

  constructor(fileUri: string) {
    this.fileUri = fileUri
  }

  toJSON() {
    const fileUriArray = compact(this.fileUri.split(path.sep))

    const findIndexCallback = (o) => new RegExp(`^(app|spec|test|lib)$`).test(o)
    const index = fileUriArray.findIndex(findIndexCallback)
    let array = fileUriArray.slice(0, index)

    if (isEmpty(array)) {
      array = fileUriArray.slice(0, 1)
    }

    this.uri = array.join('/')
    this.name = array.slice(-1)[0]

    return {
      uri: this.uri,
      name: this.name,
    }
  }

  fromFileUri(config?: any) {
    let fileUri = this.fileUri
    fileUri = fileUri.replace(this.uri, '')
    fileUri = fileUri.replace(/^\/?\/?/, '')
    fileUri = fileUri.replace(/^app\/?app\/?/, 'app/')
    fileUri = fileUri.replace(/^app\/?spec\/?/, 'spec/')
    fileUri = fileUri.replace(/^app\/?test\/?/, 'test/')

    return FileObject.fromRelativeUri(fileUri, config)
  }
}
