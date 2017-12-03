// @flow
import JSZip from 'jszip'
import fs from 'fs-extra'
import { isAbsolute, dirname, basename, extname, resolve } from 'path'
import recursiveReaddir from 'recursive-readdir'

import type { Stats } from 'fs'
type ThirdCb = (err: Error | null, res: JSZip) => void
type IgnoreFn = (file: string, stats: Stats) => boolean
type Ignores = Array<string | IgnoreFn>
type DTZFn = (
  source: string,
  ignores: ?Ignores,
  third?: ThirdCb | string | boolean,
  verbose?: boolean
) => Promise<JSZip | void>

const dtz: DTZFn = async (source, ignores, third, verbose) => {
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

  const files = await recursiveReaddir(source, ignores || [])
  const buffers = await filesToBuffers(files, source)
  const zip = createZip(buffers, verbose)

  if (typeof third === 'string' || third === true) {
    const outFile =
      third && typeof third === 'string' ? toAbsolute(third) : toDefault(source)

    if (!extname(outFile).includes(`.zip`)) {
      throw new Error(`outFile doesn't have ".zip" extension`)
    }

    const buffer = await zip.generateAsync({ type: 'nodebuffer' })
    await fs.writeFile(outFile, buffer)
    return
  } else {
    return typeof third === 'function' ? third(null, zip) : zip
  }
}

type ThrowOrCbFn = (err: Error, callback?: ThirdCb | string | boolean) => void
const throwOrCb: ThrowOrCbFn = (err, callback) => {
  if (typeof callback === 'function') {
    return callback(err)
  } else {
    throw err
  }
}

type File = { name: string, buffer: Buffer }
type FilesToBuffersFn = (files: Array<string>, source: string) => Promise<*>
type CreateZipFn = (files: Array<File>, verbose?: boolean) => JSZip

const filesToBuffers: FilesToBuffersFn = (files, source) =>
  Promise.all(
    files.map(async (file: string): Promise<File> => {
      const name: string = file.split(source)[1].slice(1)
      const buffer: Buffer = await fs.readFile(file)
      return { name, buffer }
    })
  )

const createZip: CreateZipFn = (files, verbose) => {
  const zip = new JSZip()
  files.forEach(({ name, buffer }) => {
    if (verbose) console.log(`${name} is set`)
    return zip.file(name, buffer)
  })
  return zip
}

const toAbsolute = (source: string): string =>
  isAbsolute(source) ? source : resolve(source)

const toDefault = (source: string): string =>
  resolve(dirname(source), `${basename(source)}.zip`)

export default dtz
