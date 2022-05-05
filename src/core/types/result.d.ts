/**
 * 服务响应结果
 */
export interface ResponseResult<D = null> {
  /**
   * 服务响应状态码
   */
  code?: keyof ErrorCode
  /**
   * 服务响应消息
   */
  msg?: string
  /**
   * 服务响应数据
   */
  data?: D | null
  /**
   * 实际请求地址
   */
  request?: string
}

/**
  * 服务响应状态码
  */
export interface ErrorCode {
  /**
   * 服务响应状态码 例：{200: 'OK'}
   */
  [key: number]: string
}
/**
 *  前端分页查询基础入参
 */
 export interface PaginationQuery {
  /**
   * 当前页码
   */
  page: number
  /**
   * 每页数量
   */
  size: number
  /**
   * 排序字段
   */
  orderBy?: string | string[]
  /**
   * 排序方式
   * asc: 升序
   * desc: 降序
  **/
  order?: 'asc' | 'desc'
  [key: string]: any
}

/**
 * 前端分页查询结果
 */
export interface PaginationData<D = never> {
  /**
   * 当前页码
   */
  currentPage: number
  /**
   * 每页数量
   */
  pageSize: number
  /**
   * 总计数量
   */
  total: number
  /**
   * 分页响应数据列表
   */
  records: D[],
  /**
   * 总计页数
   */
   totalPage?: number
}
