# dtz
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Build Status](https://img.shields.io/travis/kthjm/dtz.svg?style=flat-square)](https://travis-ci.org/kthjm/dtz)
[![Coverage Status](https://img.shields.io/codecov/c/github/kthjm/dtz.svg?style=flat-square)](https://codecov.io/github/kthjm/dtz)

[`recursive-readdir`](https://github.com/jergason/recursive-readdir) + [`jszip`](https://github.com/Stuk/jszip)

zip a directory manipulated by cli/promise (and callback).

## Installation
```bash
yarn add dtz
```

## Usage

### CLI
```shell
Usage: dtz [options] <src>

  Options:

    -V, --version              output the version number
    -o, --out-file <path>      dest zip path
    -i, --ignores  <filename>  ignore filenames
    -v, --verbose
    -h, --help                 output usage information
```
When `-o` is empty, zip will be generated next to `src`.

### Node.js
```js
import dtz from 'dtz';

const src = `./app`;

// promise
dtz(src,[`foo.png`])
.then(res => res.generateAsync({type: `nodebuffer`}))
.then(buffer => {

})

// async/await
(async ()=>{
    const jszip = await dtz(src,[`foo.png`]);
    const stream = res.generateNodeStream()
})()

// callback
dtz(src,[`foo.png`],(err,res)=>{
    if(err){
        console.log(err);
    }else{
        console.log(res);
    }
})

// save to disk
dtz(src,[`foo.png`],`./bar.zip`) // rename
.then(() => console.log(`done`))

dtz(src,[`foo.png`],true); // "./app.zip"

```

## API

### `dtz(src[, ignores, callback | outFile])`
##### `ignores`
pass to [`recursive-readdir`](https://github.com/jergason/recursive-readdir) as second arg.

##### `outFile`
When `true`, zip will be generated next to `src`.

##### `res`
instance of [`jszip`](https://stuk.github.io/jszip/documentation/api_jszip.html).

## License
MIT (http://opensource.org/licenses/MIT)
