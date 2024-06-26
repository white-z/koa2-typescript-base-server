import { addLog } from '../services/log.service';
import { configure, getLogger } from 'log4js'

import type { Logger } from './types'
import type { LogDocument } from '../models/types';

const IS_PROD = process.env.NODE_ENV === 'production'

const log = getLogger() as Logger

configure({
  appenders: { sys: { type: IS_PROD ? 'file' : 'console', filename: process.env.STATIC_PATH + '/sys.log' } },
  categories: { default: { appenders: ['sys'], level: IS_PROD ? 'warn' : 'all' } }
});

Object.defineProperty(log, 'db', {
  value: async (ctx: Global.KoaContext, info: string): Promise<LogDocument | undefined> => {
    try {
      const column: LogDocument = {
        ip: ctx.req.headers['x-real-ip'] || ctx.ip,
        userAgent: ctx.headers['user-agent'],
        referer: ctx.referer,
        status: ctx.status,
        method: ctx.request.method,
        protocol: ctx.request.protocol,
        host: ctx.host,
        route: ctx.request.path,
        query: ctx.querystring,
        body: ctx.request.body ? Object.keys(ctx.request.body) : [],
        responese: { code: ctx.body?.code, msg: ctx.body?.msg },
        version: ctx.props.version,
        info
      }
      const res: any = await addLog(column)
      log.warn(`${ctx.ip} Create log: ${res._id} ${ctx.request.method} ${ctx.request.path} ${ctx.status} ${info}`)
      return res
    } catch (error) {
      log.error(error)
    }
  }
})

export default log