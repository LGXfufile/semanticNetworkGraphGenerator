#!/bin/bash

# 语义网络图生成器 - 分支管理脚本

echo "=== 语义网络图生成器分支管理 ==="
echo

# 检查当前分支
current_branch=$(git branch --show-current)
echo "当前分支: $current_branch"
echo

# 显示选项
echo "请选择操作:"
echo "1. 创建并切换到test分支"
echo "2. 切换到master分支"
echo "3. 切换到test分支"
echo "4. 将test分支合并到master"
echo "5. 推送当前分支到远程"
echo "6. 推送所有分支到远程"
echo "7. 查看所有分支"
echo "0. 退出"
echo

read -p "请输入选项 (0-7): " choice

case $choice in
    1)
        echo "创建并切换到test分支..."
        git checkout -b test
        echo "已创建并切换到test分支"
        echo "推送test分支到远程..."
        git push -u origin test
        echo "test分支已推送到远程，Vercel将自动部署"
        ;;
    2)
        echo "切换到master分支..."
        git checkout master
        echo "已切换到master分支"
        ;;
    3)
        echo "切换到test分支..."
        git checkout test
        echo "已切换到test分支"
        ;;
    4)
        echo "将test分支合并到master..."
        git checkout master
        git merge test
        echo "test分支已合并到master"
        read -p "是否推送到远程? (y/n): " push_choice
        if [[ $push_choice == "y" || $push_choice == "Y" ]]; then
            git push origin master
            echo "master分支已推送到远程"
        fi
        ;;
    5)
        echo "推送当前分支 ($current_branch) 到远程..."
        git push origin $current_branch
        echo "分支已推送到远程"
        ;;
    6)
        echo "推送所有分支到远程..."
        git push --all origin
        echo "所有分支已推送到远程"
        ;;
    7)
        echo "所有分支:"
        git branch -a
        ;;
    0)
        echo "退出"
        exit 0
        ;;
    *)
        echo "无效选项"
        exit 1
        ;;
esac

echo
echo "操作完成！"
echo
echo "Vercel部署信息:"
echo "- master分支: https://semnetworkgraph.store"
echo "- test分支: https://semnetworkgraph-git-test-your-username.vercel.app"
echo "  (实际URL会在Vercel控制台中显示)" 