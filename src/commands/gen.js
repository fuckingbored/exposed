const {Command, flags} = require('@oclif/command')
const {prompt} = require('enquirer')
const path = require('path')
const fs = require('../helpers/fs')

class GenCommand extends Command {
    async run() {
        const {flags} = this.parse(GenCommand)
        let filename = flags.filename

        if (!filename) {
            const response = await prompt([
                {
                    type: 'input',
                    name: 'filename',
                    message: 'Path to entry file',
                    default: 'index.js',
                },
            ])
            filename = response.filename
        }

        let data = await fs.listDependencies(path.resolve(process.cwd(), filename))
        this.log(data)
    }
}

GenCommand.description = `xps gen => Generate a list of module dependencies
Setup everything needed to track changes, dependencies for a xps module
`

GenCommand.flags = {
    filename: flags.string({char: 'f', description: 'filename to print'}),
}

module.exports = GenCommand
