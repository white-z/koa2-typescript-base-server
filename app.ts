const SERVER_START_TIME = Date.now()

import Koa from 'koa'

// https://github.com/koajs/cors
import cors from '@koa/cors'

// https://www.npmjs.com/package/koa-body
import koaBody from 'koa-body'

// https://www.npmjs.com/package/koa-static
import koaStatic from 'koa-static'

// https://www.npmjs.com/package/koa-compress
import compress from 'koa-compress'

// https://github.com/Automattic/mongoose
import mongoose from 'mongoose'

// https://www.npmjs.com/package/koa-helmet
import helmet from 'koa-helmet'

// http server
import {createServer} from 'http'

// global config
import config from './config'

// 自定义中间件
import exception from './src/middleware/exception'
import props from './src/middleware/props'
import validToken from './src/middleware/validToken'

// routes
import routesRegister from './src/routes'

// utils
import log from './src/utils/log4js'

// import SocketServer from './src/socket'

// redis
import { client } from './src/core/redis'

/**
 * -----------------------------------------------------------------------------
 */

const NODE_ENV = process.env.NODE_ENV
 !NODE_ENV && log.error('process.env.NODE_ENV is not set, please set it to production or development')

 // redis connection
client.connect().then(() => {
  log.info('Redis Client Connected')
})

const app = new Koa()
app.proxy = true

// 捕获全局异常的中间件 (需要放在所有全局中间件之前)
app.use(exception)

// 响应头安全策略
app.use(helmet({
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  contentSecurityPolicy: false
}))

app.use(cors({
  /**
   * 响应跨域请求
   */
  origin: '*'
}))
// 响应gzip
app.use(compress({ threshold: 2048 }))

// 自定义context上下文属性
app.use(props)
// 验证token
app.use(validToken)
// 解析请求体
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 1024 * 1024 * 5  // 设置上传文件大小最大限制，默认5MB
  }
}))
// 注册静态资源路由
app.use(koaStatic(config.static, {
  maxage: 1000 * 60 * 60 * 24 * 30
}))

// API路由注册 (需要放在所有全局中间件之后)
routesRegister(app)

// 连接数据库
mongoose.connect(config.db, { 
  autoIndex: NODE_ENV !== 'production'
}).then(() => {

  log.info('Connecting database successfully')

  // 启动服务端口
  const httpServer = createServer(app.callback())
  httpServer.listen(config.port)

  log.info((NODE_ENV || '') + 'Server Create at port: ' + config.port)
  log.warn(`Server Compiled successfully in ${Date.now() - SERVER_START_TIME}ms`)

}).catch(err => {

  log.error('Failed to connect to database')
  log.error(err)

})

