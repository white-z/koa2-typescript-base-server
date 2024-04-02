import { createClient } from 'redis'

// 定义控制器命名空间
export enum ControllerNamespace {
  CHAT = 'test'
}

 class RedisManager {

  static readonly namespace: ControllerNamespace

  static readonly client = createClient({
    url: process.env.REDIS_URL
  })

  protected constructor() { }

  /**
   * 获取key
   * @param args keys, args[0] must be PrivateNamespace 
   * @returns string
   */
  protected static getKey(...args: string[]) {
    if(!this.namespace) {
      throw new Error(this.name + ': namespace is not defined')
    }
    return [this.namespace, ...args].join(':')
  }

  /**
   * 移除指定命名空间的所有key
   * @param key ControllerNamespace 
   * @param args keys
   * @returns 
   * @example RedisManager.flushDb() // remove all keys
   * RedisManager.flushDb(ControllerNamespace.ACCOUNT, 'token') // remove all keys with prefix 'account:token'
   */
  static async flushDb(key?: ControllerNamespace, ...args: string[]) {
    if(key) {
      const res = await this.client.keys(this.getKey(key, ...args))
      if(res.length) {
        return await this.client.del(res)
      }
    }
    return await this.client.flushDb()
  }
}

export default RedisManager