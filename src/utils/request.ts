import axios from 'axios'
import Exception from '../core/exception';
import { RequestHandle } from './types'
const service = axios.create({
  timeout: 60000 // 超时时间
});
service.interceptors.request.use(
  (request) => {
    const token = null
    if(token) {
      request.headers && (request.headers.Authorization = token)
    }
    return request;
  },
  (err) => {
    return Promise.reject(err);
  }
);
// 响应拦截
service.interceptors.response.use(
  (response) => {
    return response
  },
  (err) => {
    return Promise.reject(err);
  }
);

/**
 * 
 * @param method 请求方法
 * @param api 请求地址
 * @param params 请求参数
 * @param config axios配置
 * @returns Promise<any>
 */
const request: RequestHandle = async (method, api, params = {}, config = {}) => {

  const obj: {data?: any, params?: any} = {};
  if (method === 'get' || method === 'delete') {
    obj.params = params
  } else {
    obj.data = params
  }
  try {
    const res = await service({
      ...obj,
      ...config,
      method,
      url: api
    })
    return res.data
  } catch (error: any) {
    throw new Exception({code: 50006, msg: `${error?.config?.url} ${error?.message}`})
  }
  
};

export default request