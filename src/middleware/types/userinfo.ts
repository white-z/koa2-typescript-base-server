export interface Userinfo {
  /**
   * 用户唯一邮箱
   */
  account: string
  /**
   * 用户昵称
   */
  nickname: string
  /**
   * 权限
   */
  currentAuthority: 'SUPER_ADMIN' | 'ADMIN' | 'USER' | 'GUEST'
  /**
   * 用户手机号
   */
  phone: string
  /**
   * 客户端页面权限
   */
  role: any[]
  /**
   * 数据库生成的用户id
   */
  _id: string
}
