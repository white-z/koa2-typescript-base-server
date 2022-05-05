/**
 * 全局TypeScript类型定义
 */
declare module Global {
  type Koa = import('koa')
  type ParameterizedContext = import('koa').Context;
  type Next = import('koa').Next;
  interface KoaContext extends ParameterizedContext {
    /**
     * 请求处理后的返回结果
     */
    body: any
    /**
     * Koa中间件传递的自定义属性
     */
    props: import('@/middleware/types').ContextProps
  }

  interface KoaNext extends Next {}

  /**
   * 当前服务配置
   */
  interface SystemConfig {
    /**
    * 项目启动的端口
    */
    port: string
    /**
    * 后台接口前缀
    */
    apiPrefix: string
    /**
    * 数据库配置
    */
    db: string
    /**
    * 加盐的次数（用户密码加密）
    */
    saltTimes: number
    /**
    * 静态资源路径
    */
    static: string
    /**
    * 公共资源路径
    */
    publicRoute: string
    /**
    * 用于当前服务的密钥
    */
    secret: string
  }

}