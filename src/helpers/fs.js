/**
 * Bunch of helper functions for filesystem-related tasks
 */
const fs = require('fs')
const path = require('path')

// async wrapper for file existence
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
            let exists = await fileExists(p.dependency)
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
    listDependencies: listDependencies,
    directDependencies: directDependencies,
}
