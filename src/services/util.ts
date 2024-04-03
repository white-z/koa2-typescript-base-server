import type { PaginationQuery } from '@/core/types'
import type { PipelineStage } from 'mongoose'

/**
 * 获取分页聚合管道
 * @param params 
 * @param filter 
 * @returns 
 */
export const getPipeline = (params: PaginationQuery, filter?: any): PipelineStage[] => {

  params.page = Number(params.page) || 1
  params.pageSize = Number(params.pageSize) || 20

  const match = {
    createdAt: {$lte: params.startTime || new Date()},
    endTime: {$gte: params.endTime},
    ...filter
  }

  const pipeline = [
    {
      $match: match
    },
    {
      $facet: {
        metadata: [{ $count: "total" }],
        records: [
          {
            $sort: ({ [(params.orderBy as string)]: params.order === 'asc' ? 1 : -1 } as Record<string, 1 | -1>)
          },
          {
            $skip: (params.page - 1) * params.pageSize
          },
          {
            $limit: params.pageSize
          }
        ]
      }
    }
  ]

  if(params.pageSize < 0) {
    pipeline[1].$facet?.records.splice(0, 3)
  }

  return pipeline
}