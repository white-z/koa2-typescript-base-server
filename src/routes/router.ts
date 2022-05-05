import Router from '@koa/router'
import config from '../../config'
const router = new Router({prefix: config.apiPrefix});

export default router