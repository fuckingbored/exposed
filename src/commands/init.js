const {Command} = require('@oclif/command')
const {prompt} = require('enquirer')
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')
const path = require('path')
const fs = require('../helpers/fs')

const initStruct = require('../dirstructs/init/struct')

class InitCommand extends Command {
    async run() {
        try {
            // check if dir exists
            let remotesExist = await Promise.all([fs.pathExists(path.resolve(process.cwd(), '.xps/remotes.json')), fs.pathExists(path.resolve(process.cwd(), '.xps/modules.json'))])
            if (remotesExist[0] && remotesExist[1]) {
                throw new Error('An XPS project already exists here')
            }

            // copy tracking files over
            await fs.copy(initStruct.modules, path.resolve(process.cwd(), '.xps/modules.json'))
            await fs.copy(initStruct.remotes, path.resolve(process.cwd(), '.xps/remotes.json'))

            this.log('New XPS Project Created!')
        } catch (error) {
            this.log('Failed to create XPS Project:')
            this.error(error)
        }
    }
}

InitCommand.description = `xps init => Creates a new xps project
Setup everything needed to track changes, dependencies for xps modules
`
module.exports = InitCommand
