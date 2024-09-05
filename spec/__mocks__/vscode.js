const languages = {
  createDiagnosticCollection: vi.fn(),
}

const StatusBarAlignment = {}

const window = {
  createStatusBarItem: vi.fn(() => ({
    show: vi.fn(),
  })),
  showErrorMessage: vi.fn(),
  showWarningMessage: vi.fn(),
  createTextEditorDecorationType: vi.fn(),
}

const workspace = {
  getConfiguration: vi.fn(),
  workspaceFolders: [],
  onDidSaveTextDocument: vi.fn(),
}

const OverviewRulerLane = {
  Left: null,
}

const Uri = {
  file: (f) => f,
  parse: vi.fn(),
}
const Range = vi.fn()
const Diagnostic = vi.fn()
const DiagnosticSeverity = { Error: 0, Warning: 1, Information: 2, Hint: 3 }

const debug = {
  onDidTerminateDebugSession: vi.fn(),
  startDebugging: vi.fn(),
}

const commands = {
  executeCommand: vi.fn(),
}

const vscode = {
  env: { remoteName: '' },
  languages,
  StatusBarAlignment,
  window,
  workspace,
  OverviewRulerLane,
  Uri,
  Range,
  Diagnostic,
  DiagnosticSeverity,
  debug,
  commands,
}

module.exports = vscode
