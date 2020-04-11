const {Command} = require('@oclif/command')
const {prompt} = require('enquirer')
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')
const path = require('path')
const fs = require('../helpers/fs')

class StatusCommand extends Command {
    async run() {
        try {
            // check if xps project exists
            let projExists = await fs.lookup('.xps/modules.json')
            if (!projExists) {
                throw new Error('fatal: not an xps repository (or any of the parent directories): .xps')
            }

            this.log('Changes not staged for commit:')
        } catch (error) {
            this.error(error)
        }
    }
}

StatusCommand.description = `xps status => Checks the status of the current xps module or project
Displays file changes and tracking status
`
module.exports = StatusCommand
