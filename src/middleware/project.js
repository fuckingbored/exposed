
const hfs = require('../helpers/fs')
const fs = require('fs-extra')
const path = require('path')

const BypassError = require('../helpers/err').BypassError
const initStruct = require('../properties/dirStructs/init/init')

// check if an xps project exists, if it does return it's path, if not null
async function projectExists(startDir = process.cwd()) {
    // search for the directory
    let projExists = await hfs.lookup(path.resolve(startDir, '.xps/'))
    if (!projExists) {
        return
    }
    return projExists
}

// check to make sure xps project is properly initialized, if yes, true, else false
async function initExists(startDir = process.cwd() + '/.xps') {
    // make sure files exist
    let projIntegrity = await Promise.all(Object.keys(initStruct).map(k => fs.pathExists(path.resolve(startDir, initStruct[k].path))))

    for (let i = 0; i < projIntegrity.length; i++) {
        if (!projIntegrity[i])
            return false
    }

    return true
}

// copy all init files to the init path
async function copyInit(startDir = process.cwd() + '/.xps') {
    // create dir
    await fs.ensureDir(startDir)

    await Promise.all(Object.keys(initStruct).map(k => fs.copyFile(initStruct[k].content, path.resolve(startDir, initStruct[k].path))))
}

module.exports = {
    initExists: initExists,
    projectExists: projectExists,
    copyInit: copyInit,
}
