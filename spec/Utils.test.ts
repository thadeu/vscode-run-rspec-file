import * as vscode from 'vscode'
import { describe, expect, test, vi } from 'vitest'
import { getWorkspace } from '../src/Utils'
import WorkSpace from '../src/WorkSpace'

describe('#getWorkspace', () => {
  test('/Users/developer/todo-bcdd/app/models/user.rb', () => {
    let filepath = '/Users/developer/todo-bcdd/app/models/user.rb'

    let workspaceFolders = [{ name: 'todo-bcdd', uri: vscode.Uri.file('/Users/developer/todo-bcdd'), index: 0 }]
    vi.spyOn(vscode.workspace, 'workspaceFolders', 'get').mockReturnValue(workspaceFolders)

    // @ts-ignore
    vi.spyOn(vscode.window, 'activeTextEditor', 'get').mockReturnValue({ document: { uri: { path: filepath } } })

    const workSpace: WorkSpace | any = getWorkspace()

    expect(workSpace.name).toEqual('todo-bcdd')
    expect(workSpace.remoteName).toEqual('')
    expect(workSpace.uri).toEqual('/Users/developer/todo-bcdd')
    expect(workSpace.method.rootUri).toEqual('/Users/developer/todo-bcdd')
    expect(workSpace.method.originalUri).toEqual('/Users/developer/todo-bcdd')
    expect(workSpace.method.fileUri).toEqual('/Users/developer/todo-bcdd/app/models/user.rb')
  })

  test('/User/developer/todo-app/packs/test_results/spec/features/review_results/review_results_spec.rb', () => {
    let filepath = '/Users/developer/todo-app/packs/test_results/spec/features/review_results/review_results_spec.rb'

    let workspaceFolders = [{ name: 'todo-app', uri: vscode.Uri.file('/Users/developer/todo-app'), index: 0 }]
    vi.spyOn(vscode.workspace, 'workspaceFolders', 'get').mockReturnValue(workspaceFolders)

    // @ts-ignore
    vi.spyOn(vscode.window, 'activeTextEditor', 'get').mockReturnValue({ document: { uri: { path: filepath } } })

    const workSpace: WorkSpace | any = getWorkspace()

    expect(workSpace.name).toEqual('todo-app')
    expect(workSpace.remoteName).toEqual('')
    expect(workSpace.uri).toEqual('/Users/developer/todo-app')
    expect(workSpace.method.rootUri).toEqual('/Users/developer/todo-app')
    expect(workSpace.method.originalUri).toEqual('/Users/developer/todo-app')
    expect(workSpace.method.fileUri).toEqual('/Users/developer/todo-app/packs/test_results/spec/features/review_results/review_results_spec.rb')
  })
})
