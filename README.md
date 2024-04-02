# koa2-typescript-base-server
使用typescript开发的koa2 mongoose 基础模板 包含日志记录 分页查询

# 使用提醒 2024-04-02
  因为本项目为基础模板，功能较少，我会不定期更新package.json中的依赖项至最新版本，
  克隆此项目后，可手动将package.json文件内的依赖项迁移至最新稳定版本，方便后续使用。

  项目默认创建了数据库`koa2TypescriptBaseServer`
  可在`.env`文件内修改项目配置

# 基础功能
- test.controller
  定义了一些测试接口操作redis
- log.controller
  分页查询/删除数据库操作日志; 查询/删除系统文本日志

# 使用说明
- 确保本地安装了 
  node.js >= 14.18.2
  mongoDB
  redis
  typescript

- 安装依赖并启动 3031端口
```bash
> npm install 或 yarn install
> npm run dev 或 yarn dev
```

启动后可尝试请求 
POST: http://localhost:3031/api/test/get_version
会返回json
```json
{"code":200,"msg":"OK","data":{"version":"1.0.1","env":"development"}}

```
- redis设置值：
GET: /api/test/set_value?value=abc
```json
{"code":200,"msg":"OK","data":null}
```
- redis获取值：
GET: /api/test/get_value
```json
{"code":200,"msg":"OK","data":"abc"}
```
- redis清除全部缓存：
POST: /api/test/flushdb
清除操作会被记录在数据库日志中。

- 分页查询日志列表：
GET: /api/log/get_dblog

- 分页响应和分页查询的逻辑查看
`src\core\result.ts`和`src\services\log.service.ts`


- 项目打包
```bash
> npm run build 或 yarn build
```
