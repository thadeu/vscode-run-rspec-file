import * as vscode from 'vscode'
import { describe, expect, test, vi } from 'vitest'
import FileObject from '../src/FileObject'
import WorkSpace from '../src/WorkSpace'

describe('#toJSON', () => {
  test('with rails app spec file', () => {
    let filepath = 'spec/controllers/aliquots_controller_spec.rb'
    let object = new FileObject(filepath, { integration: 'rails', folder: 'spec', suffix: 'spec' })

    let result = object.toJSON()

    expect(object.isLibrary(result.path)).toBe(false)
    expect(object.isExpectation(result.path)).toBe(true)

    expect(result.name).toBe('controllers/aliquots_controller_spec.rb')
    expect(result.ext).toBe('.rb')
    expect(result.namespace).toBe('spec')
    expect(result.suffix).toBe('spec')

    expect(result.isRailsApp).toBe(true)
    expect(result.inversePath).toBe('app/controllers/aliquots_controller.rb')
    expect(result.specPath).toBe('spec/controllers/aliquots_controller_spec.rb')
  })

  test('with rails spec file and custom controllers folder', () => {
    let workspaceFolders = [{ name: 'todo-bcdd', uri: vscode.Uri.file('/Users/developer/todo-bcdd'), index: 0 }]
    vi.spyOn(vscode.workspace, 'workspaceFolders', 'get').mockReturnValue(workspaceFolders)

    let filepath = '/Users/developer/todo-bcdd/spec/requests/aliquots_controller_spec.rb'

    let config = {
      integration: 'rails',
      folder: 'spec',
      suffix: 'spec',
      controllerFolder: 'requests',
    }

    const workSpace = new WorkSpace(filepath).toJSON()

    let object = new FileObject(filepath, config, workSpace)

    let result = object.toJSON()

    expect(object.isLibrary(filepath)).toBe(false)
    expect(object.isExpectation(filepath)).toBe(true)

    expect(result.name).toBe('requests/aliquots_controller_spec.rb')
    expect(result.ext).toBe('.rb')
    expect(result.namespace).toBe('spec')
    expect(result.suffix).toBe('spec')

    expect(result.isRailsApp).toBe(true)
    expect(result.specPath).toBe('spec/requests/aliquots_controller_spec.rb')
    expect(result.inversePath).toBe('app/controllers/aliquots_controller.rb')
  })

  test('with rails spec file and custom controllers folder', () => {
    let workspaceFolders = [{ name: 'todo-bcdd', uri: vscode.Uri.file('/Users/developer/todo-bcdd'), index: 0 }]
    vi.spyOn(vscode.workspace, 'workspaceFolders', 'get').mockReturnValue(workspaceFolders)

    let filepath = '/Users/developer/todo-bcdd/app/controllers/users_controller.rb'

    const workSpace = new WorkSpace(filepath).toJSON()
    let object = new FileObject(filepath, { controllerFolder: 'requests' }, workSpace)
    let result = object.toJSON()

    expect(result.name).toBe('controllers/users_controller.rb')
    expect(result.ext).toBe('.rb')
    expect(result.namespace).toBe('app')

    expect(result.isRailsApp).toBe(true)
    expect(result.specPath).toBe('spec/requests/users_controller_spec.rb')
    expect(result.inversePath).toBe('spec/requests/users_controller_spec.rb')
  })

  test('with rails app file', () => {
    let filepath = 'app/controllers/aliquots_controller.rb'
    let object = new FileObject(filepath, { integration: 'rails', folder: 'spec', suffix: 'spec' })

    let result = object.toJSON()

    expect(object.isLibrary(filepath)).toBe(false)
    expect(object.isExpectation(filepath)).toBe(false)

    expect(result.name).toBe('controllers/aliquots_controller.rb')
    expect(result.ext).toBe('.rb')
    expect(result.namespace).toBe('app')
    expect(result.suffix).toBe(undefined)

    expect(result.isRailsApp).toBe(true)
    expect(result.inversePath).toBe('spec/controllers/aliquots_controller_spec.rb')
    expect(result.specPath).toBe('spec/controllers/aliquots_controller_spec.rb')
  })

  test('with library file', () => {
    let workspaceFolders = [{ name: 'todo-bcdd', uri: vscode.Uri.file('/Users/developer/todo-bcdd'), index: 0 }]
    vi.spyOn(vscode.workspace, 'workspaceFolders', 'get').mockReturnValue(workspaceFolders)

    let filepath = '/Users/developer/todo-bcdd/lib/send_sms.rb'

    const workSpace = new WorkSpace(filepath).toJSON()

    let object = new FileObject(filepath, {}, workSpace)
    let result = object.toJSON()

    expect(object.isLibrary(filepath)).toBe(true)
    expect(object.isExpectation(filepath)).toBe(false)

    expect(result.name).toBe('lib/send_sms.rb')
    expect(result.ext).toBe('.rb')
    expect(result.namespace).toBe('lib')
    expect(result.suffix).toBe(undefined)

    expect(result.isRailsApp).toBe(true)
    expect(result.inversePath).toBe('spec/lib/send_sms_spec.rb')
    expect(result.specPath).toBe('spec/lib/send_sms_spec.rb')
  })

  test('with library spec file', () => {
    let workspaceFolders = [{ name: 'todo-bcdd', uri: vscode.Uri.file('/Users/developer/todo-bcdd'), index: 0 }]
    vi.spyOn(vscode.workspace, 'workspaceFolders', 'get').mockReturnValue(workspaceFolders)

    let filepath = '/Users/developer/todo-bcdd/spec/lib/send_sms_spec.rb'

    const workSpace = new WorkSpace(filepath).toJSON()
    let object = new FileObject(filepath, {}, workSpace)

    let result = object.toJSON()

    expect(object.isLibrary(filepath)).toBe(true)
    expect(object.isExpectation(filepath)).toBe(true)

    expect(result.name).toBe('lib/send_sms_spec.rb')
    expect(result.ext).toBe('.rb')
    expect(result.namespace).toBe('spec')
    expect(result.suffix).toBe('spec')

    expect(result.isRailsApp).toBe(true)
    expect(result.inversePath).toBe('lib/send_sms.rb')
    expect(result.specPath).toBe('spec/lib/send_sms_spec.rb')
  })

  test('when workspace use spec file', () => {
    let filepath = 'test/lib/complete_account_test.rb'

    let object = new FileObject(filepath, { integration: 'other', folder: 'test', suffix: 'test' })
    let result = object.toJSON()

    expect(object.isLibrary(filepath)).toBe(true)
    expect(object.isExpectation(filepath)).toBe(true)

    expect(result.name).toBe('lib/complete_account_test.rb')
    expect(result.ext).toBe('.rb')
    expect(result.namespace).toBe('test')
    expect(result.suffix).toBe('test')

    expect(result.isRailsApp).toBe(false)
    expect(result.inversePath).toBe('lib/complete_account.rb')
    expect(result.specPath).toBe('test/lib/complete_account_test.rb')
  })

  test('when workspace use app folder', () => {
    let workspaceFolders = [{ name: 'todo-bcdd', uri: vscode.Uri.file('/Users/developer/todo-bcdd'), index: 0 }]
    vi.spyOn(vscode.workspace, 'workspaceFolders', 'get').mockReturnValue(workspaceFolders)

    let filepath = '/Users/developer/todo-bcdd/app/models/user.rb'

    const workSpace = new WorkSpace(filepath).toJSON()

    let object = new FileObject(filepath, {}, workSpace)
    let result = object.toJSON()

    expect(result.specPath).toBe('spec/models/user_spec.rb')
  })
})
