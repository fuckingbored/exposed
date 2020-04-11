const path = require('path')

// stores the dir structure for init
module.exports = {
    modules: {path: './modules.json', content: path.resolve(__dirname, './modules.json')},
    remotes: {path: './remotes.json', content: path.resolve(__dirname, './remotes.json')},
}
