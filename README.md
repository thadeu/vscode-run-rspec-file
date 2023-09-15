# Run RSpec Extension for Visual Studio Code (vscode)

This extension provides basic commands for running spec files in build-in vscode terminal.

## Table of Contents <!-- omit in toc -->
  - [Motivation](#motivation)
  - [Features](#features)
  - [Documentation](#documentation)
  - [Available Commands](#available-commands)
  - [Settings](#settings)
    - [Custom command](#custom-command)
    - [Custom folder](#custom-folder)
    - [Custom Suffix File](#custom-suffix-file)
    - [Use cases](#use-cases)
  - [Contributing](#contributing)
  - [License](#license)

## Motivation

Facility run RSpec in the VSCode Terminal

## Documentation <!-- omit in toc -->

Version    | Documentation
---------- | -------------
unreleased | https://github.com/thadeu/vscode-run-rspec-file/blob/main/README.md

## Features

* Run only current line with cmd+l (RSpec: Run Line on RSpec)
* Search and Run Spec based current file with cmd+alt+l (RSpec: Run File on RSpec)
* Search and open file with cmd+alt+o (RSpec: Run Open spec this file)
* 🎉 Toggle file between spec and source file with cmd+alt+o (RSpec: Run Open spec this file)
* Run on last spec with cmd+y (RSpec: Run On Last Spec)
* Run All Opened Files with `cmd+alt+j` (RSpec: Run All Opened Files) [Issue #20](https://github.com/thadeu/vscode-run-rspec-file/issues/20)

## Available Commands

```json
[
    {
        "command": "extension.runLineOnRspec",
        "key": "cmd+l",
        "when": "editorLangId == 'ruby'"
    },
    {
        "command": "extension.runAllOpenedFiles",
        "key": "cmd+alt+j",
        "when": "editorLangId == 'ruby'"
    },
    {
        "command": "extension.runFileOnRspec",
        "key": "cmd+alt+l",
        "when": "editorLangId == 'ruby'"
    },
    {
        "command": "extension.runOpenSpec", // and toggle between files
        "key": "cmd+alt+o",
        "when": "editorLangId == 'ruby'"
    },
    {
        "command": "extension.runOnLastSpec",
        "key": "cmd+y",
        "when": "editorLangId == 'ruby'"
    }
]
```

| Description                           | Command       |
|-------------                          | -------       |
| Run Active Line in the Active File    | `cmd+l`       |
| Run Opened Files in the Workspace     | `cmd+alt+j`   |
| Run Single Active File                | `cmd+alt+l`   |
| Toggle file                           | `cmd+alt+o`   |
| Run Last Command                      | `cmd+y`       |
|                                       |               |

Enjoy!

## Settings

### Custom command

You might want to prefix the rspec command with something like docker or foreman.

With this configuration you can customize your rspec command as you please. Example when using foreman:

```json
{
  "vscode-run-rspec-file.custom-command": "foreman run bundle exec rspec --color"
}
```

### Custom folder

You want to work in other folder. With this configuration you can customize rspec command to run a custom folder.

```json
{
  "vscode-run-rspec-file.folder": "test"
}
```

### Custom Suffix File

You want to work with other suffix file, for exemplo, if you use Minitest, you set `_test.rb` suffix. So, with this configuration you might customize suffix file. 

```json
{
    "vscode-run-rspec-file.suffix": "test"
}
```

The default is `bundle exec rspec --color`.

You can also customize it per project by adding the same configuration to your project's `.vscode/settings.json`.

### Custom folder for controller specs

You should now write specs for your controllers as request specs ([source](http://rspec.info/blog/2016/07/rspec-3-5-has-been-released/)). The default thus is to create controller specs at `spec/requests`, but this can be changed via:

```json
{
  "vscode-run-rspec-file.controller-spec-directory": "requests"
}
```

### Custom integration type

You can configure kind of integration would you use. Like `rails` or `lib` `others`. When `rails` is activated, we go mount workspace folder based in your structure for folders. For example:

Rails usually use `app`, `lib`, `spec` or `test` folders, so, in your workspace must be first part before this folders. This add suport to use in multi-root/folders projects.

```json
{ "vscode-run-rspec-file.integration": "rails" }
```

### Use cases

Project use another format to tests, like as:

```
| MundiAPI-RUBY
  |- lib
  |- test
    |- test_charges_controller.rb
```

So you can configure like this.

```json
{
  "vscode-run-rspec-file.custom-command": "bundle exec rake test",
  "vscode-run-rspec-file.folder": "test",
  "vscode-run-rspec-file.suffix": "",
  "vscode-run-rspec-file.integration": "other"
}
```

Another example, when use minitest instead of rspec

```
| packwerk
  |- lib
  |- test
    |- integration
      |- packwerk
        |- custom_executable_integration_test.rb
```

```json
{
  "vscode-run-rspec-file.custom-command": "bundle exec rake test",
  "vscode-run-rspec-file.folder": "test",
  "vscode-run-rspec-file.suffix": "test",
  "vscode-run-rspec-file.integration": "minitest"
}
```

As result `bundle exec rake test test/integration/packwerk/custom_executable_integration_test.rb`

And using Rails like Application and RSpec.

```json
{
  "vscode-run-rspec-file.custom-command": "bundle exec rspec",
  "vscode-run-rspec-file.folder": "spec",
  "vscode-run-rspec-file.suffix": "spec",
  "vscode-run-rspec-file.integration": "rails"
}
```

# Contributing

Once you've made your great commits (include tests, please):

1. Fork this repository
2. Create a topic branch - `git checkout -b my_branch`
3. Push to your branch - `git push origin my_branch`
4. Create a pull request

That's it!

Please respect the indentation rules and code style. And use 2 spaces, not tabs. And don't touch the version thing or distribution files; this will be made when a new version is going to be released.

# MIT License

Copyright (c) 2018 Thadeu Esteves

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.