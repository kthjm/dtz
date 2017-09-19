'use strict'

Object.defineProperty(exports, '__esModule', {
   value: true
})

var _regeneratorRuntime = require('regenerator-runtime')

var _regeneratorRuntime2 = _interopRequireDefault(_regeneratorRuntime)

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

function _asyncToGenerator(fn) {
   return function() {
      var gen = fn.apply(this, arguments)
      return new Promise(function(resolve, reject) {
         function step(key, arg) {
            try {
               var info = gen[key](arg)
               var value = info.value
            } catch (error) {
               reject(error)
               return
            }
            if (info.done) {
               resolve(value)
            } else {
               return Promise.resolve(value).then(
                  function(value) {
                     step('next', value)
                  },
                  function(err) {
                     step('throw', err)
                  }
               )
            }
         }
         return step('next')
      })
   }
}

const dtz = (() => {
   var _ref = _asyncToGenerator(
      /*#__PURE__*/ _regeneratorRuntime2.default.mark(function _callee(
         source,
         ignores,
         third,
         verbose
      ) {
         var files, buffers, zip, outFile, buffer
         return _regeneratorRuntime2.default.wrap(
            function _callee$(_context) {
               while (1)
                  switch ((_context.prev = _context.next)) {
                     case 0:
                        if (source) {
                           _context.next = 2
                           break
                        }

                        return _context.abrupt(
                           'return',
                           throwOrCb(new Error(`source is undefined`), third)
                        )

                     case 2:
                        if (!(typeof source !== 'string')) {
                           _context.next = 4
                           break
                        }

                        return _context.abrupt(
                           'return',
                           throwOrCb(
                              new Error(`TypeError: source isn't string`),
                              third
                           )
                        )

                     case 4:
                        if (!(ignores && !Array.isArray(ignores))) {
                           _context.next = 6
                           break
                        }

                        return _context.abrupt(
                           'return',
                           throwOrCb(
                              new Error(`TypeError: ignores isn't array`),
                              third
                           )
                        )

                     case 6:
                        source = toAbsolute(source)

                        _context.next = 9
                        return (0, _recursiveReaddir2.default)(
                           source,
                           ignores || []
                        )

                     case 9:
                        files = _context.sent
                        _context.next = 12
                        return filesToBuffers(files, source)

                     case 12:
                        buffers = _context.sent
                        zip = createZip(buffers, verbose)

                        if (!(typeof third === 'string' || third === true)) {
                           _context.next = 26
                           break
                        }

                        outFile =
                           third && typeof third === 'string'
                              ? toAbsolute(third)
                              : toDefault(source)

                        if (
                           (0, _path.extname)(outFile).indexOf(`.zip`) !== -1
                        ) {
                           _context.next = 18
                           break
                        }

                        throw new Error(`outFile doesn't have ".zip" extension`)

                     case 18:
                        _context.next = 20
                        return zip.generateAsync({ type: 'nodebuffer' })

                     case 20:
                        buffer = _context.sent
                        _context.next = 23
                        return _fsExtra2.default.writeFile(outFile, buffer)

                     case 23:
                        return _context.abrupt('return')

                     case 26:
                        return _context.abrupt(
                           'return',
                           typeof third === 'function' ? third(null, zip) : zip
                        )

                     case 27:
                     case 'end':
                        return _context.stop()
                  }
            },
            _callee,
            undefined
         )
      })
   )

   return function dtz(_x, _x2, _x3, _x4) {
      return _ref.apply(this, arguments)
   }
})()

const throwOrCb = (err, callback) => {
   if (typeof callback === 'function') {
      return callback(err)
   } else {
      throw err
   }
}

const filesToBuffers = (files, source) =>
   Promise.all(
      files.map(
         (() => {
            var _ref2 = _asyncToGenerator(
               /*#__PURE__*/ _regeneratorRuntime2.default.mark(
                  function _callee2(file) {
                     var name, buffer
                     return _regeneratorRuntime2.default.wrap(
                        function _callee2$(_context2) {
                           while (1)
                              switch ((_context2.prev = _context2.next)) {
                                 case 0:
                                    name = file.split(source)[1].slice(1)
                                    _context2.next = 3
                                    return _fsExtra2.default.readFile(file)

                                 case 3:
                                    buffer = _context2.sent
                                    return _context2.abrupt('return', {
                                       name,
                                       buffer
                                    })

                                 case 5:
                                 case 'end':
                                    return _context2.stop()
                              }
                        },
                        _callee2,
                        undefined
                     )
                  }
               )
            )

            return function(_x5) {
               return _ref2.apply(this, arguments)
            }
         })()
      )
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
