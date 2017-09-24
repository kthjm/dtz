import assert from 'assert'
import dtz from '../lib/index'

const src = './lib'

describe(`lib`, () => {
   it(`generateAsync`, async () => {
      const res = await dtz(src)
      const buffer = await res.generateAsync({ type: 'nodebuffer' })
      assert.deepStrictEqual(buffer.constructor, Buffer)
   })

   it(`generateNodeStream`, async () => {
      const res = await dtz(src)
      const stream = res.generateNodeStream()
      assert.ok(stream.readable)
   })

   it(`promise`, () =>
      dtz(src)
         .then(res => res.generateAsync({ type: 'nodebuffer' }))
         .then(buffer => assert.deepStrictEqual(buffer.constructor, Buffer)))

   it(`callback`, () => {
      dtz(src, null, (err, res) => {
         assert.ok(res)
      })
   })
})
