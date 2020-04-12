const fs = require('fs-extra')
const path = require('path')

const BypassError = require('../helpers/err').BypassError

// check if a tracker exists, if it does return true
async function trackerExists(startDir = process.cwd()) {
    let trackExists = await fs.pathExists(path.resolve(startDir, 'xps.json'))
    if (trackExists) {
        throw new BypassError('an xps module already exists here')
    }
    return trackExists
}

module.exports = {
    trackerExists: trackerExists,
}
