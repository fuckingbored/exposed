const {Command} = require('@oclif/command')
const {prompt} = require('enquirer')
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')
const path = require('path')
const fs = require('../helpers/fs')
const BypassError = require('../helpers/err').BypassError

class TrackCommand extends Command {
    async run() {
        try {
            // check if xps project exists
            let projExists = await fs.lookup('.xps/modules.json')
            if (!projExists) {
                throw new BypassError('fatal: not an xps repository (or any of the parent directories): .xps')
            }

            // check if xps module tracker exists
            let trackExists = await fs.fileExists(path.resolve(process.cwd(), 'xps.json'))
            if (trackExists) {
                throw new BypassError('An XPS module already exists here')
            }

            const response = await prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'What is the module name?',
                },
                {
                    type: 'input',
                    name: 'description',
                    message: 'What is the module description?',
                },
                {
                    type: 'input',
                    name: 'entry',
                    message: 'Entry file?',
                    default: 'index.js',
                },
            ])

            // creating trackingDB
            let trackingDB = await low(new FileAsync('xps.json'))
            await trackingDB.defaults({
                name: response.name,
                description: response.description,
                entry: response.entry,
                version: '0.0.1',
                dependencies: [],
            }).write()

            // creating entry file
            let entryExists = fs.fileExists(path.resolve(process.cwd(), response.entry))
            if (entryExists) {
                let dependencies = await fs.listDependencies(path.resolve(process.cwd(), response.entry))
                await trackingDB.set('dependencies', dependencies).write()
            }

            // append to projectDB
            let projectDB = await low(new FileAsync(projExists))
            await projectDB.set(`modules.${response.name}`, trackingDB.getState()).write()

            this.log('Successfully init new XPS module')
        } catch (error) {
            if (!(error instanceof BypassError)) {
                // attempt cleanup
                await fs.remove(path.resolve(process.cwd(), './xps.json'))
            }

            this.log('Failed to init XPS module')
            this.error(error)
        }
    }
}

TrackCommand.description = `xps track => Creates a new xps module
Setup everything needed to track changes, dependencies for a xps module
`
module.exports = TrackCommand
