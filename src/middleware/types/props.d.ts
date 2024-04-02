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
}