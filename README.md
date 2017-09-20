# dtz
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Build Status](https://travis-ci.org/kthjm/dtz.svg?branch=master)](https://travis-ci.org/kthjm/dtz)
[![Coverage Status](https://coveralls.io/repos/github/kthjm/dtz/badge.svg?branch=master)](https://coveralls.io/github/kthjm/dtz?branch=master)

[`recursive-readdir`](https://github.com/jergason/recursive-readdir) + [`jszip`](https://github.com/Stuk/jszip)

zip a directory manipulated by cli/promise (and callback).

## Installation
```bash
yarn add dtz
```

## Usage

### CLI
```shell
Usage: dtz src [-o|--out-file] [-i|--ignores] [-v|--verbose]

Options:
  -o, --out-file  dest zip path
  -i, --ignores   ignore filename   [array]
  -v, --verbose   Show changes      [boolean]
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
