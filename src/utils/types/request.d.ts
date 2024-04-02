import type { Method, AxiosResponse } from 'axios'

/**
 * 发起http请求
* @param {string} method 请求方式
* @param {string} url 请求地址
* @param {object} params 请求参数
* @param {object} config 请求配置
*/
export type RequestHandle = <T = any>(method: Method, api: string, params?: RequestParams, config?: any) => Promise<T>
