import { Logger as Log4js } from 'log4js'
import { Types } from 'mongoose'
import { LogDocument } from '../models/types'

/**
   * 自定义日志类型
   */
 interface Logger extends Log4js {
  /**
   * 记录数据库操作日志
   */
  db: (ctx: KoaContext, info: string) => Promise<LogDocument>
}