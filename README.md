exposed
=======

Some package manager

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/github/package-json/v/fuckingbored/exposed)](https://github.com/fuckingbored/exposed)
[![License](https://img.shields.io/github/license/fuckingbored/exposed)](https://github.com/fuckingbored/exposed/blob/master/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g exposed-cli
$ xps COMMAND
running command...
$ xps (-v|--version|version)
exposed-cli/0.0.0 win32-x64 node-v12.13.0
$ xps --help [COMMAND]
USAGE
  $ xps COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`xps gen`](#xps-gen)
* [`xps help [COMMAND]`](#xps-help-command)
* [`xps track`](#xps-track)

## `xps gen`

xps gen => Generate a list of module dependencies

```
USAGE
  $ xps gen

OPTIONS
  -f, --filename=filename  filename to print

DESCRIPTION
  Setup everything needed to track changes, dependencies for a xps module
```

_See code: [src\commands\gen.js](https://github.com/fuckingbored/exposed/blob/v0.0.0/src\commands\gen.js)_

## `xps help [COMMAND]`

display help for xps

```
USAGE
  $ xps help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src\commands\help.ts)_

## `xps track`

xps track => Creates a new xps module

```
USAGE
  $ xps track

DESCRIPTION
  Setup everything needed to track changes, dependencies for a xps module
```

_See code: [src\commands\track.js](https://github.com/fuckingbored/exposed/blob/v0.0.0/src\commands\track.js)_
<!-- commandsstop -->
