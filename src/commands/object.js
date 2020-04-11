const {Command, flags} = require('@oclif/command')
const {prompt} = require('enquirer')
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')
const path = require('path')
const fs = require('../helpers/fs')
const crypto = require('crypto')

class ObjectCommand extends Command {
    async run() {
        try {
            const {flags} = this.parse(ObjectCommand)
            let filename = flags.filename || ''

            // if given nothing do nothing
            if (!filename) {
                return
            }

            // check if given file exists
            let fileExists = await fs.pathExists(path.resolve(process.cwd(), filename))
            if (!fileExists) {
                throw new Error('File does not exist')
            }

            // get the hash
            let fileContents = await fs.readFile(filename)
            this.log(crypto.createHash('sha256').update(fileContents).digest('hex'))
        } catch (error) {
            this.error(error)
        }
    }
}

ObjectCommand.description = `xps object => List the hash of an object
Show file contents and information
`

ObjectCommand.flags = {
    filename: flags.string({char: 'f', description: 'filename of object'}),
}

module.exports = ObjectCommand
