import log from './api/log.router'
import test from './api/test.router'
import type Koa from 'koa'
import type Router from '@koa/router'

interface Route extends Router<Koa.DefaultState, Koa.DefaultContext> {}

/**
 * register router
 * @param app Koa
 */
export default async function (app: Koa<Koa.DefaultState, Koa.DefaultContext>) {
  const routes: Route[] = [
    log,
    test,
  ]
  routes.forEach(route => {
    app.use(route.routes()).use(route.allowedMethods())
  })
}