import statuses from 'statuses'
import { ResponseResult, ErrorCode, PaginationData } from './types'

enum ResponseCode {
  OK = 200,
  SERVER_ERROR = 50000,
  INVALID_PARAMS = 50001
}

/**
 * 服务响应结果 通用返回类
 */
class Result {
  
  protected constructor() {}
  
  static ResponseCode = ResponseCode
  /**
   * 服务响应状态码列表
   */
  public static readonly ERR_CODE: ErrorCode = {
    200: 'OK',
    50000: 'Server Error',
    50001: 'Invalid Params'
  }
  /**
   * 请求处理成功方法
   * @example Result.success<D>({msg: '响应消息', code: keyof ErrorCode, data: D})
   */
  public static success<D = null>(res?: ResponseResult<D>): ResponseResult<D> {
    return {
      code: ResponseCode.OK,
      msg: res?.msg || this.ERR_CODE[ResponseCode.OK] || Result.ERR_CODE[ResponseCode.OK],
      data: null,
      ...res
    };
  }

  /**
   * 请求处理失败方法
   * @example Result.error<D>({msg: '响应消息', code: keyof ErrorCode, data: null})
   */
  public static error<D = null>(err?: ResponseResult<D>): ResponseResult<D> {
    const code = err?.code || ResponseCode.SERVER_ERROR;
    return {
      code,
      msg: this.ERR_CODE[code] || Result.ERR_CODE[code] || (err?.code ? statuses(err.code) : Result.ERR_CODE[ResponseCode.SERVER_ERROR]),
      data: null,
      request: undefined,
      ...err
    };
  }

  /**
   * 返回分页
   * @param {Array} data 分页数据
   * @example Result.pagination<D>({page: '当前页码', pageSize: '每页数量', total: '总计数量', records: D[]})
   */
  public static pagination<D = any>(data: PaginationData<D> = {
    page: 0,
    pageSize: 0,
    total: 0,
    records: []
  }): ResponseResult<PaginationData<D>> {

    data.totalPage = data.pageSize < 0 ? 1 : (Math.ceil(data.total / data.pageSize) || 0)
    data.total ?? (data.total = 0)
    return this.success({
      data: {
        totalPage: 0,
        ...data
      }
    })
  }
}

export default Result;
