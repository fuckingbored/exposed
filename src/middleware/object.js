const crypto = require('crypto')
const zlib = require('zlib')
const fs = require('fs')

const stream = require('stream')
const util = require('util')

const pipeline = util.promisify(stream.pipeline)

let efs = require('fs-extra')

// return hash object of content
function hashContent(content) {
    return crypto.createHash('sha256').update(content).digest('hex')
}

// save the compressed file under it's content hash in the outputdir
async function createHashedFile(filepath, outputdir) {
    let content = await util.promisify(fs.readFile)(filepath)
    let hash = hashContent(content)

    await efs.ensureDir(outputdir)

    await pipeline(fs.createReadStream(filepath), zlib.createGzip(), fs.createWriteStream(`${outputdir}/${hash}.gz`))

    return {hash: hash, content: String(content)}
}

module.exports = {
    hashContent: hashContent,
    createHashedFile: createHashedFile,
}
