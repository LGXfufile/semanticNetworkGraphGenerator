#!/bin/bash

# 语义网络图生成器 - 自动部署脚本

echo "🚀 开始部署语义网络图生成器到 semnetworkgraph.store..."

# 检查是否有未提交的更改
if [[ -n $(git status --porcelain) ]]; then
    echo "📝 发现未提交的更改，正在提交..."
    git add .
    echo "请输入提交信息 (默认: Update project):"
    read commit_message
    commit_message=${commit_message:-"Update project"}
    git commit -m "$commit_message"
fi

# 推送到远程仓库
echo "📤 推送代码到远程仓库..."
git push origin main

echo "✅ 代码推送完成！"
echo "🌐 Vercel将自动检测更改并部署"
echo "📱 请查看Vercel仪表板获取部署状态"
echo "🔗 部署完成后可访问: https://semnetworkgraph.store"
echo "🔗 备用访问地址: https://www.semnetworkgraph.store" 