const {Command} = require('@oclif/command')
const {prompt} = require('enquirer')
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')
const path = require('path')
const hfs = require('../helpers/fs')
const fs = require('fs-extra')
const BypassError = require('../helpers/err').BypassError
const {projectExists} = require('../middleware/project')
const {trackerExists} = require('../middleware/tracker')

class TrackCommand extends Command {
    async run() {
        try {
            // check if xps project exists
            let projExists = await projectExists()

            // check if xps module tracker exists
            await trackerExists()

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
            let entryExists = fs.pathExists(path.resolve(process.cwd(), response.entry))
            if (entryExists) {
                // generate list of dependencies
                let dependencies = await hfs.listDependencies(path.resolve(process.cwd(), response.entry), {
                    write: projExists + '/objects',
                })

                await trackingDB.set('dependencies', dependencies).write()
            }

            // append to projectDB
            let projectDB = await low(new FileAsync(path.resolve(projExists, 'modules.json')))
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
