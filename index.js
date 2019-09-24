import Koa from 'koa';
import path from 'path';
import fs from 'fs';
import mime from './utils/mime';
import {encryptJson,decrypt} from './utils/crypto'

const app = new Koa();

const staticPath = './assets/static'
const jsonPath = './assets/json'



app.use(async (ctx) => {
    let ctxUrl
    if(ctx.url.indexOf('/static/') === 0){
        ctxUrl = decrypt(ctx.url.replace('/static/',''))
    }else {
        ctxUrl = ctx.url
    }
    let extName = path.extname(ctxUrl)
    let ext = extName ? extName.slice(1) : 'json'
    let absolutePath = path.join(__dirname, ext==='json'?jsonPath:staticPath)
    let reqPath = path.join(absolutePath, ctxUrl+ (extName ?'':'.json'))
    let content = ''

    if( !fs.existsSync( reqPath ) ) {
        ctx.throw(404);
    } else {
        if( fs.statSync(reqPath).isDirectory() ) {
            ctx.throw(404);
        } else {
            content = await fs.readFileSync(reqPath, 'binary' )
        }
    }

    let _mime = mime[ext]

    if (_mime) {
        ctx.type = _mime
    }

    if (_mime && _mime.indexOf('image/') >= 0) {
        ctx.res.writeHead(200)
        ctx.res.write(content, 'binary')
        ctx.res.end()
    } else {
        if(ext==='json'){
            ctx.body = encryptJson(content)
        }else{
            ctx.body = content
        }
        
    }
})


app.listen(3000);

console.log('server app start at port 3000')