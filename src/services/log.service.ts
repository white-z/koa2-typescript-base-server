import LogModel from '../models/log';
import type { LogDocument } from '../models/types';
import type { PaginationQuery } from '../core/types';
import { getPipeline } from './index';


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

/** 获取日志列表（分页） */
export async function getLogList(params: PaginationQuery): Promise<{ total: number; records: LogDocument[] }> {
  const pipeline = getPipeline(params)
  const results = await LogModel.aggregate(pipeline);
  const total = results[0]?.metadata[0]?.total;
  const records = results[0]?.records;
  return { total, records }
}
