// regex patterns related to imports
module.exports = {
    IMPORT_PRESENT: /(require\(.*\))/g,
    XPS_MODULE: /('[.\\\/]+.*')|("[.\\\/]+.*")|(`[.\\\/]+.*`)/g,
    IMPORT_SRC: /('.*')|(".*")|(`.*`)/g,
}
