import RedisManager, { ControllerNamespace } from './index'

export enum TestPrivateNamespace {
  TEST = 'test'
}

class RedisTest extends RedisManager {

  static readonly namespace = ControllerNamespace.TEST
  
  static readonly #key = {
    testValue: 'testValue'
  }
  /**
   * set 设置值
   * @param expire 过期时间，默认1天
   * @example RedisTest.setTestValue('123')
   */
  static async setTestValue(value: any, expire = 60 * 60 * 24 * 1) {
    const key = this.#key.testValue
    const res = await this.client.set(key, value)
    if(res) {
      await this.client.expire(key, expire)
    }
  }
  /**
   * get 获取值
   * @example await RedisTest.getTestValue()
   */
  static getTestValue() {
    return this.client.get(this.#key.testValue)
  }
}

export default RedisTest