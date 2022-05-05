import { ResponseResult, ErrorCode, PaginationData } from './types'

/**
 * 服务响应结果 通用返回类
 */
class Result {
  
  protected constructor() {}

  /**
   * 服务响应状态码列表
   */
  public static readonly ERR_CODE: ErrorCode = {
    200: 'OK',
    50000: 'Server Error',
    50001: 'Not Logged In',
    50002: 'Invalid Authorization',
    50003: 'Session Expiration',
    50004: 'Invalid Params',
    50005: 'DataBase Error',
    50006: 'Proxy Request Failed'
  }
  /**
   * 请求处理成功方法
   * @example Result.success<D>({msg: '响应消息', code: keyof ErrorCode, data: D})
   */
  public static success<D = null>(res?: ResponseResult<D>): ResponseResult<D> {
    return {
      code: 200,
      msg: this.ERR_CODE[200] || Result.ERR_CODE[200],
      data: null,
      ...res
    };
  }

  /**
   * 请求处理失败方法
   * @example Result.error<D>({msg: '响应消息', code: keyof ErrorCode, data: null})
   */
  public static error<D = null>(err?: ResponseResult<D>): ResponseResult<D> {
    const code = err?.code || 50000
    return {
      code,
      msg: this.ERR_CODE[code] || Result.ERR_CODE[code] || Result.ERR_CODE[50000],
      data: null,
      request: undefined,
      ...err
    };
  }

  /**
   * 返回分页
   * @param {Array} data 分页数据
   * @example Result.pagination<D>({currentPage: '当前页码', pageSize: '每页数量', total: '总计数量', records: [D]})
   */
  public static pagination<D = never>(data: PaginationData<D> = {
    currentPage: 0,
    pageSize: 0,
    total: 0,
    records: []
  }): ResponseResult<PaginationData<D>> {

    data.totalPage = Math.ceil(data.total / data.pageSize)
    return this.success({
      data: {
        totalPage: 0,
        ...data
      }
    })
    
  }
}

export default Result;
