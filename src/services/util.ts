import type { PaginationQuery } from '../core/types'
import type { FilterQuery, PipelineStage } from 'mongoose'

/**
 * 获取分页聚合管道
 * @param { PaginationQuery } paginationQuery 
 * @param filter 
 * @returns pipeline, page, pageSize
 */
export const getPaginationPipeline = <T = any>(paginationQuery: PaginationQuery, filterQuery: FilterQuery<T> = {}): {
  pipeline: PipelineStage[],
  page: number,
  pageSize: number
} => {

  const params = { ...paginationQuery}

  params.page = Number(params.page)
  params.pageSize = Number(params.pageSize)

  if(isNaN(params.page) || isNaN(params.pageSize)) {
    throw new Error('Invalid page or pageSize')
  }

  const records: PipelineStage.FacetPipelineStage[] = []

  if(params.orderBy) {
    records.push({
      $sort: { [params.orderBy]: params.order === 'asc' ? 1 : -1 }
    })
  }

  if(params.pageSize === -1) {
    /** 当params.pageSize为-1时不添加分页条件
     * 可用于查询全部 */
  } else {
    if(params.pageSize === 0 || params.pageSize < -1) {
      throw new Error('Invalid pageSize')
    }
    if(params.page < 1) {
      throw new Error('Invalid page')
    }
    records.push(
      {
        $skip: (params.page - 1) * params.pageSize
      },
      {
        $limit: params.pageSize
      }
    )
  }

  const pipeline = [
    {
      $match: filterQuery
    },
    {
      $facet: {
        metadata: [{ $count: "total" }],
        records
      }
    }
  ]

  return {
    pipeline,
    page: params.page,
    pageSize: params.pageSize
  }
}

/**
 * Circumvent Invalid regular expression
 * @param str 
 * @returns string
 */
export const replaceInvalidChar = (str: string) => {
  return str.replace(/([.?*+^$[\]\\(){}|-])/g, (s) => {
    return '\\' + s
  })
}