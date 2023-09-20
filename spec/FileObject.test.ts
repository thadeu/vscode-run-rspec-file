import { describe, expect, test } from 'vitest'
import FileObject from '../src/FileObject'

describe('#toJSON', () => {
  test('with rails app spec file', () => {
    let filepath = 'spec/controllers/aliquots_controller_spec.rb'
    let object = new FileObject(filepath, { integration: 'rails', folder: 'spec', suffix: 'spec' })

    let result = object.toJSON()

    expect(object.isLibrary(filepath)).toBe(false)
    expect(object.isExpectation(filepath)).toBe(true)

    expect(result.name).toBe('controllers/aliquots_controller_spec.rb')
    expect(result.ext).toBe('.rb')
    expect(result.namespace).toBe('spec')
    expect(result.suffix).toBe('spec')

    expect(result.isRailsApp).toBe(true)
    expect(result.inversePath).toBe('app/controllers/aliquots_controller.rb')
    expect(result.specPath).toBe('spec/controllers/aliquots_controller_spec.rb')
  })

  test('with rails app file and custom controllers folder', () => {
    let filepath = 'app/controllers/aliquots_controller.rb'

    let config = {
      integration: 'rails',
      folder: 'spec',
      suffix: 'spec',
      controllerFolder: 'requests',
    }

    let object = new FileObject(filepath, config)

    let result = object.toJSON()

    expect(object.isLibrary(filepath)).toBe(false)
    expect(object.isExpectation(filepath)).toBe(false)

    expect(result.name).toBe('controllers/aliquots_controller.rb')
    expect(result.ext).toBe('.rb')
    expect(result.namespace).toBe('app')
    expect(result.suffix).toBe(undefined)

    expect(result.isRailsApp).toBe(true)
    expect(result.inversePath).toBe('spec/requests/aliquots_controller_spec.rb')
    expect(result.specPath).toBe('spec/requests/aliquots_controller_spec.rb')
  })

  test('with rails spec file and custom controllers folder', () => {
    let filepath = 'spec/requests/aliquots_controller_spec.rb'

    let config = {
      integration: 'rails',
      folder: 'spec',
      suffix: 'spec',
      controllerFolder: 'requests',
    }

    let object = new FileObject(filepath, config)

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
    let filepath = 'lib/send_sms.rb'
    let object = new FileObject(filepath, { integration: 'rails', folder: 'spec', suffix: 'spec' })

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
    let filepath = 'spec/lib/send_sms.rb'
    let object = new FileObject(filepath, { integration: 'rails', folder: 'spec', suffix: 'spec' })

    let result = object.toJSON()

    expect(object.isLibrary(filepath)).toBe(true)
    expect(object.isExpectation(filepath)).toBe(true)

    expect(result.name).toBe('lib/send_sms.rb')
    expect(result.ext).toBe('.rb')
    expect(result.namespace).toBe('spec')
    expect(result.suffix).toBe(undefined)

    expect(result.isRailsApp).toBe(true)
    expect(result.inversePath).toBe('spec/lib/send_sms_spec.rb')
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
})
