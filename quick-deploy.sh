#!/bin/bash

# 快速部署脚本

echo "=== 语义网络图生成器快速部署 ==="
echo

# 检查是否有未提交的更改
if [[ -n $(git status --porcelain) ]]; then
    echo "检测到未提交的更改:"
    git status --short
    echo
    read -p "是否提交这些更改? (y/n): " commit_choice
    
    if [[ $commit_choice == "y" || $commit_choice == "Y" ]]; then
        read -p "请输入提交信息: " commit_message
        git add .
        git commit -m "$commit_message"
        echo "更改已提交"
    else
        echo "请先提交或暂存更改"
        exit 1
    fi
fi

# 获取当前分支
current_branch=$(git branch --show-current)
echo "当前分支: $current_branch"

# 推送到远程
echo "推送到远程..."
git push origin $current_branch

echo "部署完成！"
echo

if [[ $current_branch == "master" ]]; then
    echo "生产环境: https://semnetworkgraph.store"
elif [[ $current_branch == "test" ]]; then
    echo "测试环境: 请查看Vercel控制台获取URL"
fi

echo "Vercel将自动部署您的更改" 