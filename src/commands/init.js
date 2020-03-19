const { Command, flags } = require('@oclif/command')
const { prompt } = require('enquirer');

class InitCommand extends Command {
    async run() {
        const { flags } = this.parse(InitCommand)
        const name = flags.name || 'world'
        this.log(`hello ${name} from .\\src\\commands\\hello.js`)

        const response = await prompt([
            {
                type: 'input',
                name: 'name',
                message: 'What is the module name?'
            },
            {
                type: 'input',
                name: 'description',
                message: 'What is the module description?'
            }
        ]);
        console.log(response);
    }
}

InitCommand.description = `xps init => Creates a new xps module
Setup everything needed to track changes, dependencies for a xps module
`

InitCommand.flags = {
    name: flags.string({ char: 'n', description: 'name to print' }),
}

module.exports = InitCommand
