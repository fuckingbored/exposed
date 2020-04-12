const {Command} = require('@oclif/command')
const {prompt} = require('enquirer')
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')
const path = require('path')
const hfs = require('../helpers/fs')

class StatusCommand extends Command {
    async run() {
        try {
            // check if xps project exists
            let projExists = await hfs.lookup('.xps/modules.json')
            if (!projExists) {
                throw new Error('fatal: not an xps repository (or any of the parent directories): .xps')
            }

            // check if tracker exists -> find the closest one
            let trackExists = await hfs.lookup('xps.json')
            if (!trackExists) {
                throw new Error('fatal: not an xps module (or any of the parent directories): xps.json')
            }

            // compare hashes of dependencies
            let trackingDB = await low(new FileAsync(trackExists))
            let trackingEntry = await trackingDB.get('entry').value()
            let trackingDependencies = await trackingDB.get('dependencies').value()

            let entry = await hfs.lookup(trackingEntry)
            if (!entry) {
                throw new Error('fatal: module entry does not exist')
            }

            let currentDependencies = await hfs.listDependencies(entry)

            // check intersections of dependencies

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
