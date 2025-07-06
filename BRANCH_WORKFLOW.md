# 分支工作流程

## 分支说明
- `master`: 生产环境分支，对应主域名 https://semnetworkgraph.store
- `test`: 测试环境分支，对应测试域名 (Vercel自动生成)

## 使用步骤

### 1. 创建test分支
```bash
# 使用管理脚本
chmod +x manage-branches.sh
./manage-branches.sh

# 或手动创建
git checkout -b test
git push -u origin test
```

### 2. 在test分支开发新功能
```bash
# 切换到test分支
git checkout test

# 开发新功能...
# 编辑文件...

# 提交更改
git add .
git commit -m "feat: 添加新功能"
git push origin test
```

### 3. 测试功能
- Vercel会自动部署test分支
- 在测试环境中验证功能
- 测试URL会在Vercel控制台显示

### 4. 合并到master
```bash
# 功能测试通过后，合并到master
git checkout master
git merge test
git push origin master
```

## Vercel配置说明

Vercel会自动为每个分支创建部署：
- `master` 分支 → 生产环境 (绑定自定义域名)
- `test` 分支 → 测试环境 (Vercel生成的域名)

每次推送代码到对应分支时，Vercel会自动触发部署。

## 注意事项

1. 在test分支测试新功能时，确保不影响现有功能
2. 合并到master前，务必在test环境充分测试
3. 如果需要回滚，可以从master分支创建新的修复分支 