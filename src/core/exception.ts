import type { ResponseResult } from './types'

/**
 * 自定义异常处理
 */
class Exception extends Error {

  public result: ResponseResult
  
  /**
   * 自定义Error异常
   * @param {返回的错误信息} err 
   * @example new Exception({msg: '错误信息', code: keyof ErrorCode, request: '请求地址'})
   */
  constructor(err?: ResponseResult<null>) {
    super()
    this.result = { ...err }
  }
  
  /**
   * 请求方式: 请求地址, 使用context设置
   * @param {string} value
   */
  set request(value: string) {
    this.result.request = value
  }
  
}
export default Exception