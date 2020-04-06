const {Command} = require('@oclif/command')
const {prompt} = require('enquirer')
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')
const path = require('path')
const fs = require('../helpers/fs')

class InitCommand extends Command {
    async run() {
        try {
            let initExists = await fs.fileExists(path.resolve(process.cwd(), 'xps.json'))
            if (initExists) {
                throw new Error('An XPS module already exists here')
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

            let db = await low(new FileAsync('xps.json'))
            await db.defaults({
                name: response.name,
                description: response.description,
                entry: response.entry,
                version: '0.0.1',
                dependencies: [],
            }).write()

            let entryExists = fs.fileExists(path.resolve(process.cwd(), response.entry))

            if (entryExists) {
                let dependencies = await fs.listDependencies(path.resolve(process.cwd(), response.entry))
                await db.set('dependencies', dependencies).write()
            }

            this.log('Successfully init new XPS module')
        } catch (error) {
            this.log('Failed to init XPS module')
            this.error(error)
        }
    }
}

InitCommand.description = `xps init => Creates a new xps module
Setup everything needed to track changes, dependencies for a xps module
`
module.exports = InitCommand
