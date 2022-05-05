/**
 * @des 登录请求入参
 */
export interface LoginParams {
  /**
   * 唯一账户名
   */
  account: string
  /**
   * 账户密码
   */
  password: string
  /**
   * 是否在当前设备/浏览器记住用户登录状态
   */
  remember?: boolean
}

/**
 * @des 账号注册请求入参
 */
export interface RegisterParams {
  /**
   * 唯一账户名
   */
  account: string
  /**
   * 账户密码
   */
  password: string
  /**
   * 账户昵称
   */
  nickname: string
  /**
   * 账户手机号
   */
  phone: string
  [key: string]: string
}