# Cloudflare Pages 快速部署指南

## 准备工作

### 1. 确保代码已推送到 GitHub
```bash
git add .
git commit -m "准备部署到Cloudflare"
git push origin main
```

### 2. 检查构建配置
确保 `package.json` 中有正确的构建脚本：
```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## Cloudflare Pages 部署步骤

### 1. 创建项目
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 点击左侧菜单的 **Pages**
3. 点击 **Create a project**
4. 选择 **Connect to Git**

### 2. 连接 GitHub
1. 点击 **GitHub** 按钮
2. 授权 Cloudflare 访问你的 GitHub
3. 选择包含项目的仓库

### 3. 配置构建设置
```
Project name: product-research-advisor
Production branch: main
Build command: npm run build
Build output directory: dist
Root directory: / (留空或填 /)
```

### 4. 高级设置（可选）
如果需要设置环境变量，在 **Environment variables** 部分添加：
```
VITE_APP_TITLE=产品研发建议平台
VITE_COMPANY_NAME=广东格绿朗节能科技有限公司
```

**注意：** 如果找不到 Environment variables 选项，不用担心，项目已经配置为不依赖环境变量。

### 5. 开始部署
1. 点击 **Save and Deploy**
2. 等待构建完成（通常需要2-5分钟）
3. 构建成功后会显示部署的URL

## 验证部署

### 1. 访问网站
点击提供的URL，检查：
- [ ] 页面正常加载
- [ ] 样式显示正确
- [ ] AI演示功能可用
- [ ] 所有交互正常

### 2. 测试功能
- [ ] 点击"开始AI智能分析"
- [ ] 测试快速演示功能
- [ ] 检查问答流程
- [ ] 验证建议生成

## 常见问题解决

### 问题1: 构建失败
**错误信息**: `npm ERR! missing script: build`
**解决方案**: 检查 package.json 中是否有 build 脚本

### 问题2: 页面空白
**可能原因**: 路由配置问题
**解决方案**: 检查浏览器控制台错误信息

### 问题3: 样式丢失
**可能原因**: CSS 文件路径问题
**解决方案**: 确认 Tailwind CSS 和 Ant Design 正确配置

### 问题4: 找不到 Environment variables
**解决方案**: 
1. 项目已配置为不依赖环境变量
2. 如果需要修改配置，编辑 `src/config/index.ts`
3. 重新构建和部署

## 自定义域名（可选）

### 1. 添加自定义域名
1. 在项目页面点击 **Custom domains**
2. 点击 **Set up a custom domain**
3. 输入你的域名（如：research.yourcompany.com）

### 2. 配置 DNS
根据提示在你的域名提供商处添加 CNAME 记录：
```
Type: CNAME
Name: research (或你选择的子域名)
Value: your-project.pages.dev
```

### 3. 等待生效
- DNS 配置通常需要几分钟到几小时生效
- SSL 证书会自动配置

## 更新部署

### 自动部署
每次推送到 main 分支时，Cloudflare 会自动重新构建和部署。

### 手动触发
1. 在 Cloudflare Pages 项目页面
2. 点击 **Deployments** 标签
3. 点击 **Retry deployment** 重新部署

## 监控和维护

### 查看部署日志
1. 在项目页面点击 **Deployments**
2. 点击具体的部署记录
3. 查看构建日志和错误信息

### 性能监控
- Cloudflare 提供基本的访问统计
- 可以集成 Google Analytics 进行详细分析

---

**部署完成后，你的产品研发建议平台就可以在线访问了！**

如果遇到任何问题，请检查：
1. GitHub 仓库是否包含所有必要文件
2. package.json 配置是否正确
3. 构建日志中的错误信息