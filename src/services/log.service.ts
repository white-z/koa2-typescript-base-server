import LogModel from '../models/log';
import type { LogDocument } from '../models/types';
import type { PaginationData, PaginationQuery } from '../core/types';
import { getPaginationPipeline, replaceInvalidChar } from './util';
import { FilterQuery } from 'mongoose';

interface LogQuery extends PaginationQuery {
  /** 用于字段搜索 */
  keywords?: string,
  /** 用于指定日志createdAt创建时间范围 */
  startTime?: string, 
  endTime?: string
}

/** 获取日志列表（分页）
 * @example getLogList({page: 1, pageSize: 10, keywords: 'redis', startTime: '2021-01-01', endTime: '2021-12-31'})
 */
export async function getLogList(params: LogQuery): Promise<PaginationData<LogDocument>> {
  const filter: FilterQuery<LogDocument> = {}

  if(params.keywords) {
    const reg = {$regex: new RegExp(replaceInvalidChar(params.keywords), 'i')}
    filter.$or = [
      {api: reg},
      {info: reg}
    ]
  }

  if(params.startTime) {
    filter.createdAt = {
      $gte: new Date(params.startTime)
    }
  }
  if(params.endTime) {
    filter.createdAt = {
      ...filter.createdAt,
      $lte: new Date(params.endTime)
    }
  }

  const {pipeline, page, pageSize} = getPaginationPipeline(params, filter)
  const results = await LogModel.aggregate(pipeline);
  const total = results[0]?.metadata[0]?.total;
  const records = results[0]?.records;
  return { total, records, page, pageSize}
}

/**
 * 添加日志
 */
export async function addLog(column: LogDocument) {
  return LogModel.create(column)
}

/**
 * 删除日志
 */
export async function deleteLog(_id: string) {
  return LogModel.findByIdAndDelete(_id);
}

/**
 * 清除全部日志
 */
export async function clearLog() {
  return LogModel.deleteMany();
}

/** 根据_id获取日志详情 */
export async function getLogById(_id: string) {
  return LogModel.findById(_id).lean()
}
