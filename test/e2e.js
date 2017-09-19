import assert from 'assert'
import dtz from '../lib/index'
import stream from 'stream'

const source = './test/app'

describe(`lib`, () => {
   it(`generateAsync`, async () => {
      const res = await dtz(source)
      const buffer = await res.generateAsync({ type: 'nodebuffer' })
      assert.deepStrictEqual(buffer.constructor, Buffer)
   })

   it(`generateNodeStream`, async () => {
      const res = await dtz(source)
      const stream = res.generateNodeStream()
      assert.ok(stream.readable)
   })

   it(`proimise`, () =>
      dtz(source)
         .then(res => res.generateAsync({ type: 'nodebuffer' }))
         .then(buffer => assert.deepStrictEqual(buffer.constructor, Buffer)))

   it(`callback`, () => {
      dtz(source, null, (err, res) => {
         assert.ok(res)
      })
   })
})
