
import Result from '../core/result'
import Exception from '../core/exception'
import config from '../../config'
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
    if(unexpected) {
      switch (statusCode) {
        case 404: 
          if(ctx.originalUrl.startsWith(config.publicRoute + '/images')) {
            /**
             * 图片资源不存在时重定向
             * 请不要删除项目内的 404.jpg
             */
            ctx.redirect(config.publicRoute + '/images/404.jpg');
            return
          }
        default: 
          throw new Exception({
            code: statusCode,
            msg: ctx.message
          })
      }
    }
  } catch (error: any) {
    
    const statusCode = ctx.status
    const request = `${ctx.request.method}: ${ctx.originalUrl}`

    // 自定义错误处理
    if(error instanceof Exception) {
      error.request = request
      ctx.body = Result.error(error.result)
      log.warn(error)
      return
    }
    
    // 全局未被捕获的throw错误处理
    ctx.body = Result.error({
      code: statusCode,
      msg: error?.message,
      request: request
    })
    log.error(error)
    ctx.status = statusCode
  }
}

export default exception