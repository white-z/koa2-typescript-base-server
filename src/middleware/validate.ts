import Result from '../core/result'
import { URL } from 'url'
import UAParser from 'ua-parser-js'

/**
 * 验证客户端请求是否合法
 */
const validate = async (ctx: Global.KoaContext, next: Global.KoaNext) => {
  if(ctx.path.startsWith('/public')) {
    if(ctx.request.header.referer) {
      
      const referer = new URL(ctx.request.header.referer)
      if(referer.host !== ctx.host) {
        ctx.body = null
        return
      }
    }
    const userAgent = new UAParser(ctx.headers['user-agent'])
    if(!userAgent.getBrowser().name) {
      ctx.body = null
      return
    }
    return next()
  }
  
  return next()
}

export default validate;
