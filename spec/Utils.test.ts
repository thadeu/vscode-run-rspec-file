import { describe, expect, test } from 'vitest'

import WorkSpace from '../src/WorkSpace'

const railsConfig = { integration: 'rails', folder: 'spec', suffix: 'spec' }

describe('#toogleFileUri', () => {
  test('when workspace is devcontainer', () => {
    let fileUri = '/app/app/controllers/advanced_configurations_controller.rb'

    const workspace = new WorkSpace(fileUri)
    const project = workspace.toJSON()
    const file = workspace.fromFileUri(railsConfig)

    let uri = [project.uri, file.inversePath].filter(Boolean).join('/')

    expect(uri).toBe('spec/controllers/advanced_configurations_controller_spec.rb')
  })
})
