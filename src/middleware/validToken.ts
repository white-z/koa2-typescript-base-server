import Account_col from '../models/account'
import Result from '../core/result';
// 无访问限制的接口
const pass = [
  '/api/account/register',
  '/api/account/login'
]

/**
 * 验证客户端请求Token
 */
const validToken = async (ctx: Global.KoaContext, next: Global.KoaNext) => {

  // 通过token能查询到用户Id
  if(ctx.props.accountId) {
    return next()
  }
  // pass 无需验证权限
  if(pass.includes(ctx.path)) {
    return next()
  }
  /**
   * 无访问限制的公共资源
   * @exmaple: http://localhost:3031/public/images/test.jpg
   */
  if(ctx.path.startsWith('/public')) {
    return next()
  }

  ctx.body = Result.error({code: 50001})
}

export default validToken;
