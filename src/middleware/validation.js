
const fs = require('../helpers/fs')
const path = require('path')

const BypassError = require('../helpers/err').BypassError

// check if an xps project exists, if it does return it's path
async function projectExists(startDir = process.cwd()) {
    // search for the directory
    let projExists = await fs.lookup(path.resolve(startDir, '.xps/'))
    if (!projExists) {
        throw new BypassError('fatal: not an xps repository (or any of the parent directories): .xps')
    }

    // make sure files exist
    let projIntegrity = await Promise.all([fs.pathExists(path.resolve(projExists, 'remotes.json')), fs.pathExists(path.resolve(projExists, '.xps/modules.json'))])

    for (let i = 0; i < projIntegrity.length; i++) {
        if (!projIntegrity[i])
            return
    }

    return projExists
}

// check if a tracker exists, if it does return true
async function trackerExists(startDir = process.cwd()) {
    let trackExists = await fs.fileExists(path.resolve(startDir, 'xps.json'))
    if (trackExists) {
        throw new BypassError('an xps module already exists here')
    }
    return trackExists
}

module.exports = {
    projectExists: projectExists,
    trackerExists: trackerExists,
}
