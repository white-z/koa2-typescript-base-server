// see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import * as dotenv from 'dotenv'

import Koa from 'koa'

// https://github.com/koajs/cors
import cors from '@koa/cors'

// https://www.npmjs.com/package/koa-body
import koaBody from 'koa-body'

// https://www.npmjs.com/package/koa-static
import koaStatic from 'koa-static'

// https://github.com/Automattic/mongoose
import mongoose from 'mongoose'

// https://www.npmjs.com/package/koa-helmet
import helmet from 'koa-helmet'

// 错误捕获
import exception from './src/middleware/exception'
// 上下文自定义属性
import props from './src/middleware/props'
// token验证
import validate from './src/middleware/validate'

// routes
import routesRegister from './src/routes'

// utils
import log from './src/utils/log4js'

// redis
import RedisManager from './src/core/redis'

// http server
import { createServer } from 'http'

import { getReadableTime } from './src/utils/formatDate'

dotenv.config()

const NODE_ENV = process.env.NODE_ENV

if(!NODE_ENV) {
  log.error('process.env.NODE_ENV is not set, please set it to production or development')
}

/**
 * -----------------------------------------------------------------------------
 */

// redis connection
RedisManager.client
.on('error', (err: any) => console.log('Redis Client Error', err))
.on('connect', () => log.info('Redis Client Connected'))
.connect()

const app = new Koa()

// 捕获全局异常的中间件 (需要放在所有全局中间件之前)
app.use(exception)

// 响应头安全策略
app.use(helmet({
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  contentSecurityPolicy: false
}))

// 响应跨域请求
app.use(cors({
  origin( ctx )  {
    return '*'
  },
  allowMethods: ['GET', 'POST', 'OPTIONS']
}))

// 自定义context上下文属性
app.use(props)

// 验证token
app.use(validate)

// 解析请求体
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 1024 * 1024 * 50  // 设置上传文件大小最大限制，默认50Mb
  }
}))

/** 注册静态资源路由
 * @example [http://localhost:3031/public/images/test.jpg]
 */
app.use(koaStatic(process.env.STATIC_PATH, {
  maxage: 1000 * 60 * 60 * 24 * 30
}))

// API路由注册 (需要放在所有全局中间件之后)
routesRegister(app)
// 连接数据库
mongoose.set('strictQuery', true);
mongoose.connect(process.env.DB_URI, { 
  autoIndex: NODE_ENV !== 'production',
}).then(async () => {

  log.info('Connecting database successfully')
  // 启动服务端口
  const httpServer = createServer(app.callback())
  httpServer.listen(process.env.PORT, () => {
    log.info((NODE_ENV ? NODE_ENV + ' ' : '') + 'HTTP server started at port: ' + process.env.PORT)
  })
  if(typeof performance !== 'undefined') {
    log.warn(`Server Compiled successfully in ${getReadableTime(performance.now())}`)
  }

  // SocketServer.create(httpServer)
  
}).catch((err: any) => {
  log.error('Failed to connect to database')
  log.error(err)
})

