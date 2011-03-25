var fs = require('fs'),
    parse = require('./lib/cssp').parse,
    format = require('./lib/cssf').format;

if (process.argv.length === 3) {
    console.log(format(parse(fs.readFileSync(process.argv[2]).toString()).nodes, ''));
}
