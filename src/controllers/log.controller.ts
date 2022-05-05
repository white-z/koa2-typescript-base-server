import Log_col from '../models/log';
import Result from '../core/result';
import fs from 'fs/promises'
import config from '../../config';
import log from '../utils/log4js';

const getDBLog = async (ctx: Global.KoaContext, next: Global.KoaNext) => {
  const req = ctx.request.query
  const params = {
    page: 0,
    size: 20,
    order: 'asc',
    orderBy: 'createdAt',
    startTime: '',
    endTime: '',
    logId: null
  }
  Object.keys(params).forEach(key => {
    if(Object.prototype.hasOwnProperty.call(req, key)) {
      if(key === 'page' || key === 'size') {
        params[key] = parseInt(req[key] as string)
      } else {
        Reflect.set(params, key, req[key])
      }
    }
  })
  const filter = {}

  if(params.startTime) {
    Reflect.set(filter, 'createdAt.$gte', params.startTime)
  }

  if(params.endTime) {
    Reflect.set(filter, 'createdAt.$lte', params.endTime)
  }

  if(params.logId) {
    Reflect.set(filter, '_id', params.logId)
  }

  const [total, records] = await Promise.all([
    Log_col.countDocuments(filter),
    Log_col.find(filter)
    .sort({[params.orderBy]: params.order === 'asc' ? 1 : -1})
    .skip(params.page * params.size)
    .limit(params.size).lean()
  ])

  ctx.body = Result.pagination({
    currentPage: params.page,
    total: total,
    records: records,
    pageSize: params.size
  })
}

const clearDBLog = async (ctx: Global.KoaContext, next: Global.KoaNext) => {
  const res = await Log_col.deleteMany()
  ctx.body = Result.success({data: res})
  log.db(ctx, '清除数据库日志')
}

const getSysLog = async (ctx: Global.KoaContext, next: Global.KoaNext) => {
  ctx.body = process.env.NODE_ENV === 'development' ? Result.success({
    msg: '开发环境未记录系统日志'
  }) : await fs.readFile(config.static + '/sys.log', 'utf8')
}

const clearSysLog = async (ctx: Global.KoaContext, next: Global.KoaNext) => {
  await fs.writeFile(config.static + '/sys.log', '')
  ctx.body = Result.success({msg: '清除成功'})
  log.db(ctx, '清除系统日志')
}

export default {
  getDBLog,
  clearDBLog,
  getSysLog,
  clearSysLog
}