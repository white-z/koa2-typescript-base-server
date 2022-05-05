import { Userinfo } from './userinfo'
/**
 * Koa Context 全局上下文自定义字段
 */
export interface ContextProps {
  /**
   * 当前服务版本
   */
  readonly version: string
  /**
   * 当前请求的ip
   */
  readonly ip: string
  /**
   * 当前登录用户的账号id
   */
  readonly accountId: string | null
  /**
   * 当前用户信息
   */
  userinfo: Userinfo | null
}