#!/bin/bash

echo "🚀 开始部署语义网络图生成器..."

# 检查Git状态
echo "📋 检查Git状态..."
git status

# 添加所有更改
echo "📝 添加文件到Git..."
git add .

# 提交更改
echo "💾 提交更改..."
read -p "请输入提交信息: " commit_message
git commit -m "$commit_message"

# 推送到GitHub
echo "📤 推送到GitHub..."
git push origin main

# 触发Vercel部署
echo "🔄 触发Vercel部署..."
vercel --prod

echo "✅ 部署完成！"
echo "🌐 网站地址: https://semnetworkgraph.store" 