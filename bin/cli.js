#!/usr/bin/env node

const dtz = require('../lib')
const yargs = require('yargs')

const argv = yargs
   .usage('Usage: dtz src [-o|--out-file] [-i|--ignores] [-v|--verbose]')
   .demandCommand(1)
   .strict()
   .alias(`h`, `help`)
   .alias('o', 'out-file')
   .describe('o', 'dest zip path')
   .alias('i', 'ignores')
   .describe('i', 'ignore filename')
   .array(`i`)
   .boolean('verbose')
   .alias('v', 'verbose')
   .describe('v', 'Show changes')
   .parse()

const source = argv._[argv._.length - 1]
dtz(source, argv.ignores, argv.outFile || true, argv.verbose).catch(err =>
   console.error(err)
)
