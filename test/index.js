import assert from 'assert'
import rewire from 'rewire'
import { resolve } from 'path'

const modules = rewire('../src')

describe(`src`, () => {
   const dtz = modules.default

   const sourceRelative = `hoge`
   const sourceAbsolute = resolve(sourceRelative)
   const stubAbsoluteFiles = [
      resolve(`${sourceRelative}/foo/bar.png`),
      resolve(`${sourceRelative}/foo/bar.jpg`),
      resolve(`${sourceRelative}/foo/bar.svg`),
      resolve(`${sourceRelative}/foo/bar.md`)
   ]
   const stubBuffer = `buffer`

   const recursiveReaddir = async (source, ignores) => {
      assert.deepStrictEqual(source, sourceAbsolute)
      assert.deepStrictEqual(ignores, [])
      return stubAbsoluteFiles
   }
   const fsReadFile = async file => stubBuffer
   class JSZip {
      constructor() {
         this.files = {}
      }
      file(name, buffer) {
         this.files[name] = buffer
      }
   }

   describe(`use in code`, () => {
      describe(`success`, () => {
         console.log(process.env)
         const os = process.env.OS
         const expectZip =
            os && os.toLowerCase().includes(`windows`)
               ? {
                    files: {
                       'foo\\bar.png': `buffer`,
                       'foo\\bar.jpg': `buffer`,
                       'foo\\bar.svg': `buffer`,
                       'foo\\bar.md': `buffer`
                    }
                 }
               : {
                    files: {
                       'foo/bar.png': `buffer`,
                       'foo/bar.jpg': `buffer`,
                       'foo/bar.svg': `buffer`,
                       'foo/bar.md': `buffer`
                    }
                 }

         it(`source is relative`, async () => {
            const result = await dtz(sourceRelative)
            assert.deepEqual(result, expectZip)
         })

         it(`source is absolute`, async () => {
            const result = await dtz(sourceAbsolute)
            assert.deepEqual(result, expectZip)
         })

         it(`callback`, () => {
            dtz(resolve(sourceRelative), null, (err, result) => {
               assert.deepEqual(result, expectZip)
            })
         })

         it(`verbose`, async () => {
            let currentConsoleLog = global.console.log

            let expect
            global.console.log = message => {
               if (!expect) expect = true
            }
            await dtz(sourceRelative, null, null, true)
            assert.ok(expect)

            global.console.log = currentConsoleLog
         })
      })

      describe(`throws`, () => {
         describe(`source is undefined`, () => {
            const wrongSource = undefined
            const expectMessage = `source is undefined`
            it(`promise`, async () => {
               try {
                  await dtz(wrongSource)
               } catch (err) {
                  assert.deepEqual(err.message, expectMessage)
               }
            })
            it(`callback`, () => {
               dtz(wrongSource, null, (err, res) => {
                  assert.deepEqual(err.message, expectMessage)
               })
            })
         })

         describe(`TypeError: source isn't string`, () => {
            const wrongSource = 5
            const expectMessage = `TypeError: source isn't string`
            it(`promise`, async () => {
               try {
                  await dtz(wrongSource)
               } catch (err) {
                  assert.deepEqual(err.message, expectMessage)
               }
            })
            it(`callback`, () => {
               dtz(wrongSource, null, (err, res) => {
                  assert.deepEqual(err.message, expectMessage)
               })
            })
         })

         describe(`TypeError: ignores isn't array`, () => {
            const wrongIgnores = 5
            const expectMessage = `TypeError: ignores isn't array`
            it(`promise`, async () => {
               try {
                  await dtz(sourceRelative, wrongIgnores)
               } catch (err) {
                  assert.deepEqual(err.message, expectMessage)
               }
            })
            it(`callback`, () => {
               dtz(sourceRelative, wrongIgnores, (err, res) => {
                  assert.deepEqual(err.message, expectMessage)
               })
            })
         })
      })
   })

   describe(`write to desk`, () => {
      it(`throw`, async () => {
         const wrongOutFileName = `./test.png`
         const expectMessage = `outFile doesn't have ".zip" extension`
         try {
            await dtz(sourceRelative, null, wrongOutFileName)
         } catch (err) {
            assert.deepEqual(err.message, expectMessage)
         }
      })

      describe(`success`, () => {
         it(`with outFile string`, async () => {
            const thirdOutFile = './foo/bar.zip'
            const expectOutFile = resolve(thirdOutFile)

            const _fsExtra2 = modules.__get__(`_fsExtra2`)
            const newFsExtra = Object.assign({}, _fsExtra2)
            newFsExtra.default.writeFile = async (outFile, buffer) => {
               assert.deepStrictEqual(outFile, expectOutFile)
            }
            modules.__set__({ _fsExtra2: newFsExtra })

            await dtz(sourceRelative, null, thirdOutFile)

            modules.__set__({ _fsExtra2 })
         })

         it(`without outFile string`, async () => {
            const thirdOutFile = true
            const expectOutFile = `${sourceAbsolute}.zip`

            const _fsExtra2 = modules.__get__(`_fsExtra2`)
            const newFsExtra = Object.assign({}, _fsExtra2)
            newFsExtra.default.writeFile = async (outFile, buffer) => {
               assert.deepStrictEqual(outFile, expectOutFile)
            }
            modules.__set__({ _fsExtra2: newFsExtra })

            await dtz(sourceRelative, null, thirdOutFile)

            modules.__set__({ _fsExtra2 })
         })

         let afterSet
         before(() => {
            afterSet = { _jszip2: modules.__get__(`_jszip2`) }
            const JSZip = afterSet._jszip2.default
            class NewJSZip extends JSZip {
               constructor() {
                  super()
               }
               async generateAsync({ type }) {
                  assert.deepStrictEqual(type, 'nodebuffer')
                  return stubBuffer
               }
            }
            modules.__set__({ _jszip2: { default: NewJSZip } })
         })

         after(() => modules.__set__(afterSet))
      })
   })

   let afterSet
   before(() => {
      afterSet = {
         _recursiveReaddir2: modules.__get__(`_recursiveReaddir2`),
         _fsExtra2: modules.__get__(`_fsExtra2`),
         _jszip2: modules.__get__(`_jszip2`)
      }
      modules.__set__({
         _recursiveReaddir2: { default: recursiveReaddir },
         _fsExtra2: { default: { readFile: fsReadFile } },
         _jszip2: { default: JSZip }
      })
   })
   after(() => modules.__set__(afterSet))
})
