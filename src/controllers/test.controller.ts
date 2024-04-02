import Result from '../core/result'
import RedisTest from '../core/redis/test'
import RedisManager from '../core/redis';
import log from '../utils/log4js';

export const getVersion = async (ctx: Global.KoaContext, next: Global.KoaNext) => {
  ctx.body = Result.success({data: {
    version: ctx.props.version,
    env: process.env.NODE_ENV || 'unknown'
  }});
}

export const setValue = async (ctx: Global.KoaContext, next: Global.KoaNext) => {
  const { value } = ctx.request.query
  await RedisTest.setTestValue(value)
  ctx.body = Result.success()
}

export const getValue = async (ctx: Global.KoaContext, next: Global.KoaNext) => {
  const value = await RedisTest.getTestValue()
  ctx.body = Result.success({data: value})
}


export const flushdb = async (ctx: Global.KoaContext, next: Global.KoaNext) => {
  try {
    await RedisManager.flushDb()
    ctx.body = Result.success()
    log.db(ctx, 'redis flushdb success')
  } catch (err: any) {
    ctx.body = Result.error({msg: err.message})
  } 
}
