# Run RSpec Extension for Visual Studio Code (vscode)

This extension provides basic commands for running spec files in build-in vscode terminal.

## Features

* Run only current line with cmd+l (RSpec: Run Line on RSpec)
* Search and Run Spec based current file with cmd+alt+l (RSpec: Run File on RSpec)
* Search and open file _spec with cmd+alt+o (RSpec: Run Open spec this file)
* 🎉 Toggle file between spec and source file with cmd+alt+o (RSpec: Run Open spec this file)
* Run on last spec with cmd+y (RSpec: Run On Last Spec)

Available commands:

```json
[
    {
        "command": "extension.runLineOnRspec",
        "key": "cmd+l",
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

Enjoy!

## Settings

### Custom command

You might want to prefix the rspec command with something like docker or foreman.

With this configuration you can customize your rspec command as you please. Example when using foreman:

```json
{
  "vscode-run-rspec-file.custom-command": "foreman run bundle exec rspec --color",
}
```

The default is `bundle exec rspec --color`.

You can also customize it per project by adding the same configuration to your project's `.vscode/settings.json`.

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