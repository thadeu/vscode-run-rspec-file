import { describe, expect, test } from 'vitest'
import WorkSpace from '../src/WorkSpace'

const railsConfig = { integration: 'rails', folder: 'spec', suffix: 'spec' }

describe('#toJSON', () => {
  test('when workspace is one folder', () => {
    let fileUri = '/Users/thadeu/code/opensource-community/todo-bcdd/app/models/todo/item/complete.rb'

    const workSpace = new WorkSpace(fileUri)
    const project = workSpace.toJSON()
    const file = workSpace.fromFileUri(railsConfig)

    expect(project.uri).toBe('Users/thadeu/code/opensource-community/todo-bcdd')
    expect(project.name).toBe('todo-bcdd')
    expect(file.path).toBe('app/models/todo/item/complete.rb')
  })

  test('when workspace is two folder', () => {
    let fileUri = '/Users/thadeu/code/opensource-community/todo-bcdd/app/models/todo/item/complete.rb'

    const workSpace = new WorkSpace(fileUri)
    const project = workSpace.toJSON()
    const file = workSpace.fromFileUri(railsConfig)

    expect(project.uri).toBe('Users/thadeu/code/opensource-community/todo-bcdd')
    expect(project.name).toBe('todo-bcdd')
    expect(file.path).toBe('app/models/todo/item/complete.rb')
  })

  test('when workspace use spec file', () => {
    let fileUri = '/Users/thadeu/code/opensource-community/todo-bcdd/spec/models/todo/item/complete_spec.rb'

    const workSpace = new WorkSpace(fileUri)
    const project = workSpace.toJSON()
    const file = workSpace.fromFileUri(railsConfig)

    expect(project.uri).toBe('Users/thadeu/code/opensource-community/todo-bcdd')
    expect(project.name).toBe('todo-bcdd')
    expect(file.path).toBe('spec/models/todo/item/complete_spec.rb')
  })

  test('when workspace use spec file', () => {
    let fileUri = '/Users/thadeu/code/opensource-community/todo-bcdd/test/models/todo/item/complete_test.rb'

    const config = { integration: 'rails', folder: 'test', suffix: 'test' }
    const workSpace = new WorkSpace(fileUri)
    const project = workSpace.toJSON()
    const file = workSpace.fromFileUri(config)

    expect(project.uri).toBe('Users/thadeu/code/opensource-community/todo-bcdd')
    expect(project.name).toBe('todo-bcdd')
    expect(file.path).toBe('test/models/todo/item/complete_test.rb')
  })

  test('when workspace use spec file', () => {
    let fileUri = '/Users/thadeu/code/opensource-community/packwerk/test/lib/complete_account_test.rb'

    const workSpace = new WorkSpace(fileUri)
    const project = workSpace.toJSON()
    const file = workSpace.fromFileUri({ integration: 'other', folder: 'test', suffix: 'test' })

    expect(project.uri).toBe('Users/thadeu/code/opensource-community/packwerk')
    expect(project.name).toBe('packwerk')
    expect(file.path).toBe('test/lib/complete_account_test.rb')
  })

  test('when workspace use spec file', () => {
    let fileUri = '/Users/thadeu/code/opensource-community/packwerk/lib/complete_account.rb'

    const workSpace = new WorkSpace(fileUri)
    const project = workSpace.toJSON()
    const file = workSpace.fromFileUri({ integration: 'other', folder: 'test', suffix: 'test' })

    expect(project.uri).toBe('Users/thadeu/code/opensource-community/packwerk')
    expect(project.name).toBe('packwerk')
    expect(file.path).toBe('lib/complete_account.rb')
    expect(file.specPath).toBe('test/lib/complete_account_test.rb')
  })

  test('when workspace use spec file', () => {
    let fileUri =
      '/Users/thadeu/code/atendesimples/atendesimples-app/spec/controllers/advanced_configurations_controller_spec.rb'

    const workSpace = new WorkSpace(fileUri)
    const project = workSpace.toJSON()
    const file = workSpace.fromFileUri(railsConfig)

    expect(project.uri).toBe('Users/thadeu/code/atendesimples/atendesimples-app')
    expect(project.name).toBe('atendesimples-app')
    expect(file.path).toBe('spec/controllers/advanced_configurations_controller_spec.rb')
    expect(file.specPath).toBe('spec/controllers/advanced_configurations_controller_spec.rb')
  })
})
