/**
 * Bunch of helper functions for filesystem-related tasks
 */
const fs = require('fs-extra')
const path = require('path')

// async wrapper for file existence
// @DEPRECATED
async function fileExists(path) {
    return new Promise((res, rej) => {
        fs.access(path, fs.F_OK, err => {
            if (err) {
                res(false)
            }
            res(true)
        })
    })
}

// async wrapper for readfile
async function readFile(path, encoding = 'utf8') {
    return new Promise((res, rej) => {
        fs.readFile(path, encoding, (err, data) => {
            if (err) {
                rej(err)
            }
            res(data)
        })
    })
}

// looks for a path in the current and parent directories up to a given level
async function lookup(path, level = 10) {
    let currentPath = path
    let pathExists = await fs.pathExists(currentPath)
    let currentLevel = 0
    do {
        console.log(currentPath)
        pathExists = await fs.pathExists(currentPath)
        if (pathExists)
            return currentPath

        currentPath = '../' + currentPath
        currentLevel++
    } while (!pathExists && (currentLevel < level || !level))
}

// returns a list of direct dependencies of a given entry file
async function directDependencies(entry) {
    let file = await readFile(entry)
    let dependencies = file.match(/(require\(.*\))/g)
    if (dependencies) {
        dependencies = dependencies.map(d => {
            if (d.match(/('[.\\\/]+.*')|("[.\\\/]+.*")|(`[.\\\/]+.*`)/g)) {
                let match = d.match(/('.*')|(".*")|(`.*`)/g)[0]
                match = match.substring(1, match.length - 1)

                if (!match.includes('.js'))
                    match += '.js'

                return {type: 'xps', dependency: match}
            }
            let match = d.match(/('.*')|(".*")|(`.*`)/g)[0]
            match = match.substring(1, match.length - 1)
            return {type: 'npm', dependency: match}
        })
    }
    return dependencies
}

// returns a list of all the dependencies of a given entry and it's children
async function listDependencies(entry) {
    let children = [{type: 'xps', dependency: entry}]
    let listDepends = []
    let dependencies = []
    let cPath = ''
    while (children.length > 0) {
        try {
            let p = children.pop(0)
            let exists = await fs.pathExists(p.dependency)
            if (exists) {
                cPath = p.dependency.match(/(.*\/)|(.*\\)/g)[0]
                let depends = await directDependencies(p.dependency)
                if (depends) {
                    depends = depends.filter(d => {
                        return !dependencies.includes((d.type == 'xps') ? path.join(cPath, d.dependency) : d.dependency)
                    })
                    dependencies = dependencies.concat(depends.map(d => ((d.type == 'xps') ? path.join(cPath, d.dependency) : d.dependency)))
                    children = children.concat(depends.map(d => ({type: d.type, dependency: (d.type == 'xps') ? path.join(cPath, d.dependency) : d.dependency})))
                    listDepends = listDepends.concat(depends.map(d => ({type: d.type, dependency: (d.type == 'xps') ? path.join(cPath, d.dependency) : d.dependency})))
                }
            }
        } catch (error) {
            this.error(error)
        }
    }
    return listDepends
}

module.exports = {
    fileExists: fileExists,
    readFile: readFile,
    lookup: lookup,
    listDependencies: listDependencies,
    directDependencies: directDependencies,
    ...fs,
}
