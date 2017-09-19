# dtz
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)


## API

### CLI
```shell
Usage:

```

### Node.js
```js
import dtz from "dtz";

const dir = "./app";

dtz(dir).then((res)=>{

})

dtz(dir,[`hoge.png`]).then((res)=>{

});

dtz(dir,[`hoge.png`],(err,res)=>{

})

dtz(dir,null,(err,res)=>{

})

dtz(dir,[`hoge.png`],"./wfewfwe.zip");
dtz(dir,[`hoge.png`],true);
```

### `dtz(dir[, ignores, outFile | callback])`

<!-- ```js
import dtz from "dtz";

const dir = "./app";

// save to disk
dtz(dir);

dtz(dir,{
    ignores: [`hoge.png`]
});

dtz(dir,{
    ignores: [`hoge.png`],
    outFile: "./wfewfwe.zip"
});


// use response
dtz(dir,{res: true})
.then((zip)=>{
    zip.generateAsync()
})
.catch((err)=>{

})

(async ()=>{
    const zip = await dtz(dir,{res: true});
    zip.generateNodeStream()
})()

dtz(dir,{res: true},(err,zip)=>{

})
``` -->

## License
MIT (http://opensource.org/licenses/MIT)
