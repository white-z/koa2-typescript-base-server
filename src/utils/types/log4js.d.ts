import { Logger as Log4js } from 'log4js'

/**
   * 自定义日志类型
   */
 interface Logger extends Log4js {
  /**
   * 记录数据库操作日志
   */
  db: (ctx: KoaContext, info: string) => Promise<void>
}
/**
 * 客户端操作日志数据库字段
 */
export interface LogContent {
  /**
   * 请求方法
   */
  method: string
  /**
   * 请求来源的主机名
   */
  host: string
  /**
   * 请求的路由
   */
  route: string
  /**
   * 响应状态码
   */
  status: number
  /**
   * 请求来源 document.referrer
   */
  referer: string
  /**
   * 请求协议
   */
  protocol: string,
  /**
   * 当前服务端版本
   */
  version: string
  /**
   * 关于记录本次日志到数据库的描述
   */
  info: string
  /**
   * 来源IP
   */
  ip?: string | string[]
  /**
   * 响应结果
   */
  responese?: any
  /**
   * 执行本次请求的用户账号id
   */
  accountId?: string | null,
  /**
   * 客户端的user-agent
   */
  userAgent?: string
  /**
   * 请求路径中的参数
   */
  query?: string
  /**
   * 请求体中的参数
   */
  body?: any
}