# 🚀 MVP版本 - 真实AI配置指南

## 立即启用真实AI功能

### 方法1：Cloudflare Pages环境变量（推荐）
1. 登录Cloudflare Dashboard
2. 进入你的Pages项目
3. 点击 "Settings" → "Environment variables"
4. 添加变量：
   ```
   REACT_APP_OPENAI_API_KEY = sk-your-actual-api-key-here
   ```
5. 重新部署项目

### 方法2：直接修改代码（快速测试）
在 `project/src/services/aiService.ts` 第35行：
```typescript
apiKey: config.apiKey || process.env.REACT_APP_OPENAI_API_KEY || 'sk-your-api-key-here',
```
把 `'sk-your-api-key-here'` 替换为你的真实API密钥

## 获取OpenAI API密钥

1. 访问：https://platform.openai.com/
2. 注册/登录账号
3. 进入 "API Keys" 页面
4. 点击 "Create new secret key"
5. 复制密钥（sk-开头的字符串）

## 成本控制

**当前配置：**
- 模型：GPT-3.5 Turbo（性价比最高）
- 预估成本：每次完整分析约 $0.10-0.20
- 月度预算：100次分析约 $10-20

**节省成本技巧：**
- 设置API使用限额
- 监控每日使用量
- 优化提示词长度

## 验证AI功能

配置完成后，访问你的网站：
1. 点击"开始AI智能分析"
2. 等待6秒演示完成
3. 查看生成的建议
4. 如果内容专业且具体，说明AI功能正常

## 故障排除

**如果AI不工作：**
1. 检查API密钥是否正确
2. 确认账户有余额
3. 查看浏览器控制台错误
4. 重新部署项目

## 客户体验

✅ **真实AI分析**：专业的研发建议
✅ **行业专精**：针对遮阳蓬行业定制
✅ **立即可用**：无需注册，直接体验
✅ **专业输出**：包含实施方案和成本分析

---

**配置完成后，你的客户将获得真正的AI大模型分析结果！**