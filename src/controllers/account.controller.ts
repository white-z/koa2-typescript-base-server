

import config from '../../config';
import passport from '../utils/passport';
import Account_col from '../models/account';
import Passport_col from '../models/password'

import Result from '../core/result';
import {client} from '../core/redis'
import Jwt from '../core/jwt';
import { LoginParams, RegisterParams } from './types'
import Exception from '../core/exception';
import { nickname, email, phone, password } from '../utils/regex'
import log from '../utils/log4js';
import { Userinfo } from '../middleware/types';



const validateLogin = async (ctx: Global.KoaContext, next: Global.KoaNext) => {

  if(process.env.NODE_ENV === 'development') {
    // 初始化账号 ------------------------------------------***
    const accounts =  await Account_col.countDocuments()
    
    if(accounts === 0) {
      const account = await Account_col.create({
        account: 'admin',
        nickname: 'admin',
        phone: '12345678901',
        currentAuthority: 'SUPER_ADMIN'
      })
      const password = 'admin123'
      const hash = await passport.encrypt(password);
      await Passport_col.create({
        accountId: account._id,
        hash
      })
    }
    // 首次登录成功后可删除以上代码 --------------------------***
    return next()
  }

  const req: LoginParams = ctx.request.body;

  // 必要入参验证
  if(!req.account || !req.password || req.account.length > 30 || req.password.length > 30) {
    ctx.body = Result.error({msg: 'Invalid username/password'});
    return;
  }

  return next()
}

const login = async (ctx: Global.KoaContext, next: Global.KoaNext) => {

  const req: LoginParams = ctx.request.body;
  
  const query = { account: req.account }
  const account: Userinfo = await Account_col.findOne(query).lean();
  if(!account) {
    ctx.body = Result.error({msg: 'Invalid username/password'});
    return
  }
  const password = await Passport_col.findOne({
    accountId: account._id
  }).lean()
  const match = await passport.validate(req.password, password.hash);
  const expire = 60 * 60 * 24 * (req.remember ? 7 : 1); //7天过期
  if(!match) {
    ctx.body = Result.error({msg: 'Invalid username/password'});
    return
  }
  
  // 生成jsonwebtoken
  const token = Jwt.sign(query, {
    expiresIn: expire
  })
  // token存入redis
  await client.set(token, String(account._id));
  client.expire(token, expire)

  ctx.body = Result.success({
    data: {
      ...account,
      token
    }
  })
  log.db(ctx, '用户登录')
}

// 注册
const register = async (ctx: Global.KoaContext, next: Global.KoaNext) => {
  const req: RegisterParams = ctx.request.body;
  // 必要入参验证
  const required = ['account', 'password', 'nickname', 'phone'];
  required.forEach(key => {
    if(!Object.prototype.hasOwnProperty.call(req, key) || typeof req[key] !== 'string') {
      throw new Exception({code: 50004, msg: '缺少必填字段或字段格式错误'});
    }
    key !== 'password' && Reflect.set(req, key, req[key].trim())
  })
  if(!email.test(req.account)) {
    throw new Exception({code: 50004, msg: '邮箱格式错误'});
  }
  if(!password.test(req.password)) {
    throw new Exception({code: 50004, msg: '密码应当为6-20位数字、大小写字母组合'});
  }
  if(!nickname.test(req.nickname)) {
    throw new Exception({code: 50004, msg: '昵称应当为2-20位字符'});
  }
  if(!phone.test(req.phone)) {
    throw new Exception({code: 50004, msg: '手机号码格式错误'});
  }
  // 查看用户名是否重复
  const account = await Account_col.findOne({
    account: req.account
  }).lean();

  if (account) {
    ctx.body = Result.error({msg: '用户已存在'})
    return;
  }

  // 插入新用户
  const newAccount = await Account_col.create({
    account: req.account,
    nickname: req.nickname,
    phone: req.phone,
    currentAuthority: 'USER'
  }) as unknown as Userinfo;

  if (newAccount) {
    // 加密
    const hash = await passport.encrypt(req.password);
    const newPassword = await Passport_col.create({
      accountId: newAccount._id,
      hash
    })

    if (newPassword) {
      const data = {
        accountId: newAccount._id,
        account: newAccount.account
      }
      ctx.body = Result.success({
        msg: '注册成功！',
        data
      })
      log.db(ctx, '注册账号: ' + JSON.stringify(data))
    }
  } else {
    ctx.body = Result.error({msg: '注册失败！'});
  }
}

// 删除账号
const disabled = async (ctx: Global.KoaContext, next: Global.KoaNext) => {
  const req = ctx.request.body;
  if(!req.account || !req.password || !req.accountId) {
    ctx.body = Result.error({msg: '用户名、密码、用户ID不能为空'});
    return;
  }
  //
  const account = await Account_col.findOne({
    account: req.account
  });
  if(account) {
    const password = await Passport_col.findOne({
      accountId: account._id
    });
    const match = await passport.validate(req.password, password.hash);
    if(match) {
      try {
        await Promise.allSettled([
          Account_col.deleteOne({
            _id: req.accountId
          }),
          Passport_col.deleteOne({
            accountId: req.accountId
          })
        ])
        await logout(ctx, next)
        ctx.body = Result.success({msg: '操作成功，账号已注销。'});
        log.db(ctx, '删除账号')
      } catch (e) {
        ctx.body = Result.error({msg: '操作失败'});
      }
    } else {
      ctx.body = Result.error({msg: '用户名或密码错误'});
    }
  } else {
    ctx.body = Result.error({msg: '此用户不存在或密码错误'});
  }
}

const resetPassword = async (ctx: Global.KoaContext, next: Global.KoaNext) => {
  const req = ctx.request.body;
  const required = ['oldPassword', 'newPassword'];
  required.forEach(key => {
    if(!Object.prototype.hasOwnProperty.call(req, key) || typeof req[key] !== 'string') {
      throw new Exception({code: 50004});
    }
  })
  const info = {
    _id: ctx.props.accountId
  }
  const account = await Account_col.findOne(info);
  if(account) {
    const password = await Passport_col.findOne({
      accountId: account._id
    });
    const match = await passport.validate(req.oldPassword, password.hash);
    if(match) {
      const hash = await passport.encrypt(req.newPassword);
      const newPassword = await Passport_col.updateOne({accountId: account._id}, {$set: {hash}})
  
      if (newPassword) {
        await logout(ctx, next)
        ctx.body = Result.success({ msg: '密码已重置'});
        log.db(ctx, '重置密码')
      } else {
        ctx.body = Result.error({code: 50005})
      }
    } else {
      ctx.body = Result.error({ msg: '密码错误或用户不存在'});
    }
  } else {
    ctx.body = Result.error({ msg: '密码错误或用户不存在'});
  }
}

const logout = async (ctx: Global.KoaContext, next: Global.KoaNext) => {
  const token = ctx.cookies.get('Token')
  if(!token) {
    ctx.body = Result.success();
    log.warn(ctx.props.ip + ': account logout but Token is not found')
    return
  }
  try {
    await client.del(token)
    ctx.body = Result.success({msg: 'Logout success'});
    log.db(ctx, '用户登出')
  } catch (error) {
    ctx.body = Result.success();
    log.error(error)
  }
}

const list = async (ctx: Global.KoaContext, next: Global.KoaNext) => {
  const req = ctx.request.query
  const params = {
    page: Number(req.page) || 0,
    size: Number(req.size) || 20
  }
  const filter = {}
  if(req.id) {
    Reflect.set(filter, '_id', req.id)
  }
  const [total, res] = await Promise.all([
    Account_col.countDocuments(filter),
    Account_col.find(filter)
    .skip(params.page * params.size)
    .limit(params.size).lean()
  ])
  ctx.body = Result.pagination({
    total,
    currentPage: params.page,
    pageSize: params.size,
    records: res 
  });
}

const update = async (ctx: Global.KoaContext, next: Global.KoaNext) => {
  const req = ctx.request.body;
  const account = await Account_col.findById(ctx.props.accountId);
  if(account) {
    const canChange = ['account', 'nickname', 'phone']
    Object.keys(req).forEach(key => {
      if(canChange.includes(key)) {
        const value = req[key]
        account.set(key, value)
      }
    })

    try {
      const userinfo: Userinfo = await account.save().lean()
      ctx.body = Result.success({msg: '更新成功', data: userinfo});
    } catch (error: any) {
      log.error(error)
      ctx.body = Result.error({msg: error?.message});
    }
  } else {
    ctx.body = Result.error({msg: '用户不存在'});
  }
}

export default {
  register,
  validateLogin,
  login,
  disabled,
  logout,
  list,
  resetPassword,
  update
}
