'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})

var _jszip = require('jszip')

var _jszip2 = _interopRequireDefault(_jszip)

var _fsExtra = require('fs-extra')

var _fsExtra2 = _interopRequireDefault(_fsExtra)

var _path = require('path')

var _recursiveReaddir = require('recursive-readdir')

var _recursiveReaddir2 = _interopRequireDefault(_recursiveReaddir)

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

const dtz = async (source, ignores, third, verbose) => {
  if (!source) {
    return throwOrCb(new Error(`source is undefined`), third)
  }

  if (typeof source !== 'string') {
    return throwOrCb(new Error(`TypeError: source isn't string`), third)
  }

  if (ignores && !Array.isArray(ignores)) {
    return throwOrCb(new Error(`TypeError: ignores isn't array`), third)
  }

  source = toAbsolute(source)

  const files = await (0, _recursiveReaddir2.default)(source, ignores || [])
  const buffers = await filesToBuffers(files, source)
  const zip = createZip(buffers, verbose)

  if (typeof third === 'string' || third === true) {
    const outFile =
      third && typeof third === 'string' ? toAbsolute(third) : toDefault(source)

    if (!((0, _path.extname)(outFile).indexOf(`.zip`) !== -1)) {
      throw new Error(`outFile doesn't have ".zip" extension`)
    }

    const buffer = await zip.generateAsync({ type: 'nodebuffer' })
    await _fsExtra2.default.writeFile(outFile, buffer)
    return
  } else {
    return typeof third === 'function' ? third(null, zip) : zip
  }
}

const throwOrCb = (err, callback) => {
  if (typeof callback === 'function') {
    return callback(err)
  } else {
    throw err
  }
}

const filesToBuffers = (files, source) =>
  Promise.all(
    files.map(async file => {
      const name = file.split(source)[1].slice(1)
      const buffer = await _fsExtra2.default.readFile(file)
      return { name, buffer }
    })
  )

const createZip = (files, verbose) => {
  const zip = new _jszip2.default()
  files.forEach(({ name, buffer }) => {
    if (verbose) console.log(`${name} is set`)
    return zip.file(name, buffer)
  })
  return zip
}

const toAbsolute = source =>
  (0, _path.isAbsolute)(source) ? source : (0, _path.resolve)(source)

const toDefault = source =>
  (0, _path.resolve)(
    (0, _path.dirname)(source),
    `${(0, _path.basename)(source)}.zip`
  )

exports.default = dtz
module.exports = exports['default']
