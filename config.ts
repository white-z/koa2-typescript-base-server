/**
 * 当前服务配置
 */
 export default {
  port: '3031',
  apiPrefix: '/api',
  db: 'mongodb://127.0.0.1:27017/base-server',
  saltTimes: 3,
  static: './static',
  publicRoute: '/public',
  /** secret
    * 用于当前服务的密钥 (jwt 加密、解密) 
    * @ 全局搜索 config.secret 查看引用
    * @！！！克隆项目后，请修改此值！！！
    * @！！！不要在开放的存储库保存此字段！！！
    */
  secret: 'SECRET_(,WD%~kT_gy3+6k_8V,$US8yzjLS'
} as Global.SystemConfig
