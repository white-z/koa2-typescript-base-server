import fsPromises from 'fs/promises'
import Result from '../core/result';
import log from '../utils/log4js';
import { getLogList, clearLog } from '../services/log.service';
import { Order } from '../core/types/enum';

export const getDBLog = async (ctx: Global.KoaContext, next: Global.KoaNext) => {
  const req = ctx.request.query
  const params = {
    page: 1,
    pageSize: 20,
    order: Order.DESC,
    orderBy: 'createdAt',
    ...req
  }
  const {total, records, page, pageSize} = await getLogList(params)
  ctx.body = Result.pagination({
    records,
    total,
    page,
    pageSize
  })
}

export const clearDBLog = async (ctx: Global.KoaContext, next: Global.KoaNext) => {
  const res = await clearLog()
  ctx.body = Result.success({data: res})
  log.db(ctx, 'Clear Database Logs')
}

export const getSysLog = async (ctx: Global.KoaContext, next: Global.KoaNext) => {
  if(process.env.NODE_ENV === 'development') {
    ctx.body = Result.success({
    msg: 'No system logs recorded in the development environment.'
    }) 
  } else {
    ctx.body = await fsPromises.readFile(process.env.STATIC_PATH + '/sys.log', 'utf8')
  }
}

export const clearSysLog = async (ctx: Global.KoaContext, next: Global.KoaNext) => {
  await fsPromises.writeFile(process.env.STATIC_PATH + '/sys.log', '')
  ctx.body = Result.success({msg: 'Clear Successfully'})
  log.db(ctx, 'Clear System logs')
}