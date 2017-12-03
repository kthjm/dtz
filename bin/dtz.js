#!/usr/bin/env node

const dtz = require('../lib')
const program = require('commander')

program
  .version(require('../package.json').version)
  .arguments(`<src>`)
  .option(`-o, --out-file <path>`, `dest zip path`)
  .option(`-i, --ignores  <filename>`, `ignore filenames`)
  .option(`-v, --verbose`)
  .action((src, opts) =>
    dtz(src, opts.ignores, opts.outFile || true, opts.verbose).catch(err => {
      console.error(err)
      process.exit(1)
    })
  )

program.parse(process.argv)

if (!program.args.length) {
  program.help()
}
