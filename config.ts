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
  secret: 'SECRET_(,WD%~kT_gy3+6k_8V,$US8yzjL'
} as Global.SystemConfig
