import account from './api/account.router'
import file from './api/file.router'
import log from './api/log.router'
import os from './api/os.router'

/**
 * register router
 * @param app Koa
 */
export default async function (app: Global.Koa) {
  const routes = {
    account,
    file,
    log,
    os
  }
  Object.keys(routes).forEach(key => {
    const route = Reflect.get(routes, key)
    app.use(route.routes()).use(route.allowedMethods())
  })
}