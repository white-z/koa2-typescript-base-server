import Log_col from '../models/log'
import { configure, getLogger } from 'log4js'
import config from '../../config'

import { LogContent, Logger } from './types'

const IS_PROD = process.env.NODE_ENV === 'production'

const log = getLogger() as Logger

// 详细配置查看 https://log4js2.github.io/log4js2-core/
configure({
  appenders: { sys: { type: IS_PROD ? 'file': 'console', filename: config.static + '/sys.log' } },
  categories: { default: { appenders: ['sys'], level: IS_PROD ? 'warn' : 'all' } }
});

/**
 * 记录数据库操作日志
 */
Object.defineProperty(log, 'db', {
  value: async (ctx: Global.KoaContext, info: string) => {
    try {
      const res = await Log_col.create({
        ip: ctx.req.headers['x-real-ip'] || ctx.ip,
        accountId: ctx.props.accountId,
        userAgent: ctx.headers['user-agent'],
        referer: ctx.referer,
        status: ctx.status,
        method: ctx.request.method,
        protocol: ctx.request.protocol,
        host: ctx.host,
        route: ctx.request.path,
        query: ctx.querystring,
        body: Object.keys(ctx.request.body),
        responese: {code: ctx.body?.code, msg: ctx.body?.msg},
        version: ctx.props.version,
        info
      } as LogContent)
      log.warn(`LogId: ${res._id} Created log: ${ctx.ip} ${ctx.request.method} ${ctx.request.path} ${ctx.status} ${info}`)
      return res
    } catch (error) {
      log.error(error)
    }
  }
})

export default log