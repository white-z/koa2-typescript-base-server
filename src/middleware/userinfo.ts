import Account_col from '../models/account'
import { client } from '../core/redis'
import { Userinfo } from './types'

/**
 * 设置当前用户信息
 */
 const userinfo = async (ctx: Global.KoaContext, next: Global.KoaNext) => {
  if(ctx.props.accountId) {
    const REDIS_KEY = 'userinfo:' + ctx.props.accountId
    const userinfo = await client.hGetAll(REDIS_KEY)
    if(userinfo._id) {
      ctx.props.userinfo = userinfo as unknown as Userinfo
    } else {
      const userinfo = await Account_col.findById(ctx.props.accountId).lean()
      if(userinfo?._id) {
        await client.hSet(REDIS_KEY, userinfo)
        ctx.props.userinfo = userinfo as Userinfo
      }
    }
  }
  return next()
}

export default userinfo