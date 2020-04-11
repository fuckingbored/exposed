const crypto = require('crypto')
const fs = require('../helpers/fs')

// return hash object of content
function hashContent(content) {
    return crypto.createHash('sha256').update(content).digest('hex')
}

// save the compressed file under it's content hash in the outputdir
async function createHashedFile(filepath, outputdir) {
    let content = await fs.readFile(filepath)
    let hash = hashContent(content)

    return hash
}

module.exports = {
    hashContent: hashContent,
}
