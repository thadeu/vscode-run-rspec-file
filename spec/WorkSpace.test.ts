import * as vscode from 'vscode'
import { describe, expect, test, vi, afterEach, beforeEach } from 'vitest'
import WorkSpace from '../src/WorkSpace'

const railsConfig = { integration: 'rails', folder: 'spec', suffix: 'spec' }

describe('#toJSON', () => {
  let workspaceFolders = []

  afterEach(() => {
    vi.restoreAllMocks()
  })

  beforeEach(() => {
    vi.spyOn(vscode.workspace, 'workspaceFolders', 'get').mockReturnValue(workspaceFolders)
  })

  describe('rails', () => {
    beforeEach(() => {
      let workspaceFolders = [{ name: 'todo-bcdd', uri: vscode.Uri.file('/Users/thadeu/code/opensource-community/todo-bcdd'), index: 0 }]
      vi.spyOn(vscode.workspace, 'workspaceFolders', 'get').mockReturnValue(workspaceFolders)
    })

    test('when workspace is one folder', () => {
      let fileUri = '/Users/thadeu/code/opensource-community/todo-bcdd/app/models/todo/item/complete.rb'

      const workSpace = new WorkSpace(fileUri)
      const project = workSpace.toJSON()
      const file = workSpace.fromFileUri(railsConfig)

      expect(project.uri).toBe('/Users/thadeu/code/opensource-community/todo-bcdd')
      expect(project.name).toBe('todo-bcdd')
      expect(file.path).toBe('app/models/todo/item/complete.rb')
    })

    test('when workspace is two folder', () => {
      let fileUri = '/Users/thadeu/code/opensource-community/todo-bcdd/app/models/todo/item/complete.rb'

      const workSpace = new WorkSpace(fileUri)
      const project = workSpace.toJSON()
      const file = workSpace.fromFileUri(railsConfig)

      expect(project.uri).toBe('/Users/thadeu/code/opensource-community/todo-bcdd')
      expect(project.name).toBe('todo-bcdd')
      expect(file.path).toBe('app/models/todo/item/complete.rb')
    })

    test('when workspace use spec file', () => {
      let fileUri = '/Users/thadeu/code/opensource-community/todo-bcdd/spec/models/todo/item/complete_spec.rb'

      const workSpace = new WorkSpace(fileUri)
      const project = workSpace.toJSON()
      const file = workSpace.fromFileUri(railsConfig)

      expect(project.uri).toBe('/Users/thadeu/code/opensource-community/todo-bcdd')
      expect(project.name).toBe('todo-bcdd')
      expect(file.path).toBe('spec/models/todo/item/complete_spec.rb')
    })

    test('when workspace use spec file', () => {
      let fileUri = '/Users/thadeu/code/opensource-community/todo-bcdd/test/models/todo/item/complete_test.rb'

      const config = { integration: 'rails', folder: 'test', suffix: 'test' }
      const workSpace = new WorkSpace(fileUri)
      const project = workSpace.toJSON()
      const file = workSpace.fromFileUri(config)

      expect(project.uri).toBe('/Users/thadeu/code/opensource-community/todo-bcdd')
      expect(project.name).toBe('todo-bcdd')
      expect(file.path).toBe('test/models/todo/item/complete_test.rb')
    })

    test('when workspace use app folder', () => {
      let workspaceFolders = [{ name: 'atendesimples-app', uri: vscode.Uri.file('/Users/thadeu/code/atendesimples-app'), index: 0 }]
      vi.spyOn(vscode.workspace, 'workspaceFolders', 'get').mockReturnValue(workspaceFolders)

      let fileUri = '/Users/thadeu/code/atendesimples/atendesimples-app/app/models/user.rb'

      const workSpace = new WorkSpace(fileUri)
      const project = workSpace.toJSON()
      const file = workSpace.fromFileUri(railsConfig)

      expect(project.uri).toBe('/Users/thadeu/code/atendesimples/atendesimples-app')
      expect(project.name).toBe('atendesimples-app')
      expect(file.path).toBe('app/models/user.rb')
      expect(file.specPath).toBe('spec/models/user_spec.rb')
    })

    test('when workspace use spec file', () => {
      let workspaceFolders = [{ name: 'atendesimples-app', uri: vscode.Uri.file('/Users/thadeu/code/atendesimples-app'), index: 0 }]
      vi.spyOn(vscode.workspace, 'workspaceFolders', 'get').mockReturnValue(workspaceFolders)

      let fileUri = '/Users/thadeu/code/atendesimples/atendesimples-app/spec/controllers/advanced_configurations_controller_spec.rb'

      const workSpace = new WorkSpace(fileUri)
      const project = workSpace.toJSON()
      const file = workSpace.fromFileUri(railsConfig)

      expect(project.uri).toBe('/Users/thadeu/code/atendesimples/atendesimples-app')
      expect(project.name).toBe('atendesimples-app')
      expect(file.path).toBe('spec/controllers/advanced_configurations_controller_spec.rb')
      expect(file.specPath).toBe('spec/controllers/advanced_configurations_controller_spec.rb')
    })
  })

  describe('packwerk', () => {
    beforeEach(() => {
      let workspaceFolders = [{ name: 'packwerk', uri: vscode.Uri.file('/Users/thadeu/code/opensource-community/packwerk'), index: 0 }]
      vi.spyOn(vscode.workspace, 'workspaceFolders', 'get').mockReturnValue(workspaceFolders)
    })

    test('when workspace use spec file', () => {
      let fileUri = '/Users/thadeu/code/opensource-community/packwerk/test/lib/complete_account_test.rb'

      const workSpace = new WorkSpace(fileUri)
      const project = workSpace.toJSON()
      const file = workSpace.fromFileUri({ integration: 'other', folder: 'test', suffix: 'test' })

      expect(project.uri).toBe('/Users/thadeu/code/opensource-community/packwerk')
      expect(project.name).toBe('packwerk')
      expect(file.path).toBe('test/lib/complete_account_test.rb')
    })

    test('when workspace use spec file', () => {
      let fileUri = '/Users/thadeu/code/opensource-community/packwerk/lib/complete_account.rb'

      const workSpace = new WorkSpace(fileUri)
      const project = workSpace.toJSON()
      const file = workSpace.fromFileUri({ integration: 'other', folder: 'test', suffix: 'test' })

      expect(project.uri).toBe('/Users/thadeu/code/opensource-community/packwerk')
      expect(project.name).toBe('packwerk')
      expect(file.path).toBe('lib/complete_account.rb')
      expect(file.specPath).toBe('test/lib/complete_account_test.rb')
    })
  })

  describe('.devcontainer', () => {
    beforeEach(() => {
      let workspaceFolders = [{ name: 'app', uri: vscode.Uri.file('/app'), index: 0 }]
      vi.spyOn(vscode.workspace, 'workspaceFolders', 'get').mockReturnValue(workspaceFolders)
      vi.spyOn(vscode.env, 'remoteName', 'get').mockReturnValue('dev-container')
    })

    test('when workspace use spec file', () => {
      let fileUri = '/app/spec/controllers/advanced_configurations_controller_spec.rb'

      const workSpace = new WorkSpace(fileUri)
      const project = workSpace.toJSON()
      const file = workSpace.fromFileUri(railsConfig)

      expect(project.uri).toBe('/app')
      expect(project.name).toBe('app')
      expect(file.path).toBe('spec/controllers/advanced_configurations_controller_spec.rb')
      expect(file.specPath).toBe('spec/controllers/advanced_configurations_controller_spec.rb')
      expect(file.inversePath).toBe('app/controllers/advanced_configurations_controller.rb')
    })

    test('when workspace use app file', () => {
      let fileUri = '/app/app/controllers/advanced_configurations_controller.rb'

      const workSpace = new WorkSpace(fileUri)
      const project = workSpace.toJSON()
      const file = workSpace.fromFileUri(railsConfig)

      expect(project.uri).toBe('/app')
      expect(project.name).toBe('app')
      expect(file.path).toBe('app/controllers/advanced_configurations_controller.rb')
      expect(file.specPath).toBe('spec/controllers/advanced_configurations_controller_spec.rb')
      expect(file.inversePath).toBe('spec/controllers/advanced_configurations_controller_spec.rb')
    })

    test('when workspace use app file', () => {
      let fileUri = '/app/app/controllers/advanced_configurations_controller.rb'

      const workSpace = new WorkSpace(fileUri)
      const project = workSpace.toJSON()
      const file = workSpace.fromFileUri(railsConfig)

      expect(project.uri).toBe('/app')
      expect(project.name).toBe('app')
      expect(file.path).toBe('app/controllers/advanced_configurations_controller.rb')
      expect(file.specPath).toBe('spec/controllers/advanced_configurations_controller_spec.rb')
      expect(file.inversePath).toBe('spec/controllers/advanced_configurations_controller_spec.rb')
    })

    test('when workspace use app file', () => {
      let fileUri = '/app/app/controllers/advanced_configurations_controller.rb'

      const workSpace = new WorkSpace(fileUri)
      const project = workSpace.toJSON()
      const file = workSpace.fromFileUri(railsConfig)

      expect(project.uri).toBe('/app')
      expect(project.name).toBe('app')
      expect(file.path).toBe('app/controllers/advanced_configurations_controller.rb')
      expect(file.specPath).toBe('spec/controllers/advanced_configurations_controller_spec.rb')
      expect(file.inversePath).toBe('spec/controllers/advanced_configurations_controller_spec.rb')
    })

    test('when workspace use spec file', () => {
      let fileUri = '/app/spec/controllers/advanced_configurations_controller_spec.rb'

      const workSpace = new WorkSpace(fileUri)
      const project = workSpace.toJSON()
      const file = workSpace.fromFileUri(railsConfig)

      expect(project.uri).toBe('/app')
      expect(project.name).toBe('app')
      expect(file.path).toBe('spec/controllers/advanced_configurations_controller_spec.rb')
      expect(file.specPath).toBe('spec/controllers/advanced_configurations_controller_spec.rb')
      expect(file.inversePath).toBe('app/controllers/advanced_configurations_controller.rb')
    })

    test('when workspace use spec file', () => {
      let fileUri = '/app/test/lib/packwerk/cache_test.rb'

      const workSpace = new WorkSpace(fileUri)
      const project = workSpace.toJSON()
      const file = workSpace.fromFileUri({ folder: 'test', suffix: 'test' })

      expect(project.uri).toBe('/app')
      expect(project.name).toBe('app')
      expect(file.path).toBe('test/lib/packwerk/cache_test.rb')
      expect(file.specPath).toBe('test/lib/packwerk/cache_test.rb')
      expect(file.inversePath).toBe('lib/packwerk/cache.rb')
    })
  })

  describe('lib', () => {
    beforeEach(() => {
      let workspaceFolders = [{ name: 'packwerk', uri: vscode.Uri.file('/Users/thadeu/developer/packwerk'), index: 0 }]
      vi.spyOn(vscode.workspace, 'workspaceFolders', 'get').mockReturnValue(workspaceFolders)
    })

    test('principal file', () => {
      let fileUri = '/Users/thadeu/developer/packwerk/lib/packwerk/cache.rb'

      const workSpace = new WorkSpace(fileUri)
      const project = workSpace.toJSON()
      const file = workSpace.fromFileUri(railsConfig)

      expect(project.uri).toBe('/Users/thadeu/developer/packwerk')
      expect(project.name).toBe('packwerk')
      expect(file.path).toBe('lib/packwerk/cache.rb')
      expect(file.inversePath).toBe('spec/lib/packwerk/cache_spec.rb')
    })

    test('spec file', () => {
      let fileUri = '/Users/thadeu/developer/packwerk/spec/lib/packwerk/cache_spec.rb'

      const workSpace = new WorkSpace(fileUri)
      const project = workSpace.toJSON()
      const file = workSpace.fromFileUri(railsConfig)

      expect(project.uri).toBe('/Users/thadeu/developer/packwerk')
      expect(project.name).toBe('packwerk')
      expect(file.path).toBe('spec/lib/packwerk/cache_spec.rb')
      expect(file.inversePath).toBe('lib/packwerk/cache.rb')
    })

    test('principal file with differente folder', () => {
      let fileUri = '/Users/thadeu/developer/packwerk/test/lib/packwerk/cache_test.rb'

      const workSpace = new WorkSpace(fileUri)
      const project = workSpace.toJSON()
      const file = workSpace.fromFileUri({ ...railsConfig, folder: 'test', suffix: 'test' })

      expect(project.uri).toBe('/Users/thadeu/developer/packwerk')
      expect(project.name).toBe('packwerk')
      expect(file.path).toBe('test/lib/packwerk/cache_test.rb')
      expect(file.inversePath).toBe('lib/packwerk/cache.rb')
    })
  })

  describe('unknown', () => {
    test('we going to use nested folders to create spec', () => {
      let workspaceFolders = [
        {
          name: 'packwerk',
          uri: vscode.Uri.file('/Users/developer/code/packwerk'),
          index: 0,
        },
      ]

      vi.spyOn(vscode.workspace, 'workspaceFolders', 'get').mockReturnValue(workspaceFolders)

      let fileUri = '/Users/developer/code/packwerk/packs/test_results/spec/features/review_results_spec.rb'

      const workSpace = new WorkSpace(fileUri)
      const project = workSpace.toJSON()
      const file = workSpace.fromFileUri({ ...railsConfig, integration: 'other' })

      expect(project.name).toBe('packwerk')
      expect(project.uri).toBe('/Users/developer/code/packwerk')

      expect(file.namespace).toBe('packs')
      expect(file.ext).toBe('.rb')
      expect(file.suffix).toBe('spec')
      expect(file.path).toBe('packs/test_results/spec/features/review_results_spec.rb')
      expect(file.specPath).toBe('packs/test_results/spec/features/review_results_spec.rb')
      expect(file.inversePath).toBe('test_results/spec/features/review_results.rb')
    })
  })
})
