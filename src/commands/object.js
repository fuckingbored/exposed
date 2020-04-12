const {Command, flags} = require('@oclif/command')
const {prompt} = require('enquirer')
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')
const path = require('path')
const fs = require('fs-extra')
const crypto = require('crypto')
const object = require('../middleware/object')
const {projectExists} = require('../middleware/project')

class ObjectCommand extends Command {
    async run() {
        try {
            const {flags} = this.parse(ObjectCommand)
            let filename = flags.filename
            let hash = flags.hash

            // if given nothing do nothing
            if (filename) {
                // check if given file exists
                let fileExists = await fs.pathExists(path.resolve(process.cwd(), filename))
                if (!fileExists) {
                    throw new Error('File does not exist')
                }

                // get the hash
                let fileContents = await fs.readFile(filename)
                this.log(object.hashContent(fileContents))
            } else if (hash) {
                // find project root
                let projExists = await projectExists()
                if (!projExists) {
                    throw new Error('fatal: not an xps repository (or any of the parent directories): .xps')
                }

                // check objects filesystem for hash
                let objExists = await fs.pathExists(`${projExists}/objects/${hash}.gz`)
                if (!objExists) {
                    throw new Error('supplied hash not associated with an object')
                }

                // read hashed contents
                let hashContents = await object.readGzip(`${projExists}/objects/${hash}.gz`)
                this.log(hashContents)
            }
        } catch (error) {
            this.error(error)
        }
    }
}

ObjectCommand.description = `xps object => List the hash of an object
Show file contents and information
`

ObjectCommand.flags = {
    filename: flags.string({char: 'f', description: 'filename of object', exclusive: ['hash']}),
    hash: flags.string({char: 'h', description: 'show hash object contents', exclusive: ['filename']}),
    write: flags.string({char: 'w', description: 'write hashed object to database', dependsOn: ['filename']}),
}

module.exports = ObjectCommand
