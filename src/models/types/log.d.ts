export interface LogDocument {
  /**
   * @description client ip
   */
  ip: string | string[]
  /**
   * @description client user agent
   */
  userAgent?: string
  /**
   * @description http status code
   */
  statusCode?: number
  /**
   * @description request method
   */
  method: string
  /**
   * @description request route path
   */
  route: string
  /**
   * @description referer host
   */
  host?: string
  /**
   * @description referer path
   */
  referer?: string
  /**
   * @description referer status
   */
  status?: number
  /**
   * @description referer protocol
   */
  protocol?: string
  /**
   * @description about log information
   */
  info?: string
  /**
   * @description request query
   */
  query?: string
  /**
   * @description request body
   */
  body?: object
  /**
   * @description server response
   */
  response?: object
  /**
   * @description current package.json version
   */
  version?: string

  /**
   * @description responese
   */
  responese?: { code: number; msg: string }

  /**
   * @description create time
   */
  createdAt?: Date
}
