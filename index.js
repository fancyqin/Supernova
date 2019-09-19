import Koa from 'koa';
import path from 'path';
import mime from './utils/mime';


const app = new Koa();

const assetsPath = './assets'

// 解析资源类型
function parseMime(url) {
    let extName = path.extname(url)
    extName = extName ? extName.slice(1) : 'unknown'
    return mime[extName]
}

app.use(async (ctx) => {

    let absolutePath = path.join(__dirname, assetsPath)

    let _content = await content(ctx, absolutePath)

    let _mime = parseMime(ctx.url)

    if (_mime) {
        ctx.type = _mime
    }

    if (_mime && _mime.indexOf('image/') >= 0) {
        ctx.res.writeHead(200)
        ctx.res.write(_content, 'binary')
        ctx.res.end()
    } else {
        ctx.body = _content
    }
})


app.listen(3000);

console.log('server app start at port 3000')