const {Command} = require('@oclif/command')
const {initExists, copyInit} = require('../middleware/project')

class InitCommand extends Command {
    async run() {
        try {
            // check project existence
            let initExist = await initExists()
            if (initExist) {
                throw new Error('xps project already exists here')
            }
            // copy tracking files over
            await copyInit()

            this.log('New xps project created!')
        } catch (error) {
            this.log('Failed to create xps project:')
            this.error(error)
        }
    }
}

InitCommand.description = `xps init => Creates a new xps project
Setup everything needed to track changes, dependencies for xps modules
`
module.exports = InitCommand
