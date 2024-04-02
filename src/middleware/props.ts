/**
 * Koa请求上下文自定义属性
 */
const props = async (ctx: Global.KoaContext, next: Global.KoaNext) => {

  ctx.props = {
    version: process.env.npm_package_version || '0.0.0',
    ip: (ctx.req.headers['x-real-ip'] as string) || ctx.ip,
  }

  return next()
}

export default props
