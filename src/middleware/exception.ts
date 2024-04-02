
import Result from '../core/result'
import Exception from '../core/exception'
import log from '../utils/log4js'

/**
 * 请求自定义异常处理
 */
const exception = async (ctx: Global.KoaContext, next: Global.KoaNext) => {
  try {
    
    await next()
    const statusCode = ctx.status;
    // unexpected = 未设置返回值并且status是4或5开头的数字
    const unexpected = ctx.body === undefined && ! /^(1|2|3)/.test(String(statusCode))
    ctx.status = statusCode
    if(statusCode && unexpected) {
      throw new Exception({
        code: statusCode
      })
    }
  } catch (error: any) {
    const statusCode = ctx.status
    const request = `${ctx.request.method}: ${ctx.originalUrl}`

    // 自定义错误处理
    if(error instanceof Exception) {
      error.request = request
      ctx.body = Result.error(error.result)
      log.error(`IP: ${ctx.props.ip} Create bad request: ${request}`, error)
      return
    }
    // 全局未被捕获的throw错误处理
    ctx.body = Result.error({
      code: statusCode,
      msg: error?.message,
      request: request
    })
    log.error(`IP: ${ctx.props.ip} Create bad request: ${request}`, error)
    ctx.status = statusCode
  }
}

export default exception