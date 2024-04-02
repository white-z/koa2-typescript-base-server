declare module 'ali-oss'
declare module 'check-disk-space'
declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV?: 'development' | 'production'
    DB_URI: string
    REDIS_URL: string
    PORT: string
    STATIC_PATH: string
  }
}

/**
 * 全局TypeScript类型定义
 */
declare module Global {
  type Context = import('koa').Context;
  type Next = import('koa').Next;
  
  interface KoaContext extends Context {
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

}