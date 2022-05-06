# koa2-typescript-base-server
使用typescript开发的koa2 mongoose 基础模板 包含登录注册 日志记录 分页查询

# 使用提醒 2022-05-05
  因为本项目为基础模板，功能较少，我会不定期更新package.json中的依赖项至最新版本，
  克隆此项目后，您可手动将package.json文件内的依赖项迁移至最新稳定版本，方便后续使用。

# 基础功能
- account.controller
  登录/登出;
  注册;
  修改密码;
  查询/修改用户信息;
  用户列表
- file.controller
  上传文件
- log.controller
  分页查询/删除数据库操作日志; 查询/删除系统文本日志
- os.controller
  查询CPU/内存/磁盘信息

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
启动后可尝试请求 POST: http://localhost:3031/api/account/login
- 接口入参为初始账号密码
```
{
  account: 'admin', 
  password: 'admin123'
}
```
登录成功后，接口会返回token, 保存token至cookie用于验证; 
具体验证逻辑查看：
```
src\middleware\validToken.ts
src\middleware\props.ts 
```

- 项目打包
```bash
> npm run build:tsc 或 yarn build:tsc
```
- 项目打包并混淆加密
```bash
> npm run build 或 yarn build
```
