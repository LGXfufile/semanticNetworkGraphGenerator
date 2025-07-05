# 语义网络图生成器

🌐 一个基于Web的语义网络图生成工具，支持上传Excel文件自动生成可交互的网络图。

## 功能特性

- 📊 **Excel文件解析**: 支持上传.xlsx/.xls格式文件
- 🎨 **可视化网络图**: 基于ECharts生成交互式网络图
- 📥 **模版下载**: 提供标准数据模版，避免格式错误
- 🖼️ **图片导出**: 支持将网络图导出为PNG格式
- 🎯 **节点分类**: 支持多种节点类型和颜色区分
- 📱 **响应式设计**: 适配不同设备屏幕

## 在线体验

🚀 [在线访问](https://your-project.vercel.app)

## 数据格式

Excel文件应包含以下列：

| 节点A | 节点B | 关系类型 | 节点A类型 | 节点B类型 |
|-------|-------|----------|-----------|-----------|
| 西湖  | 美丽  | 正面评价 | 旅游地    | 正面评论词 |
| 西湖  | 贵   | 负面评价 | 旅游地    | 负面评论词 |

### 节点类型说明

- **旅游地** (黑色) - 旅游目的地
- **正面评论词** (浅蓝色) - 正面情感词汇  
- **负面评论词** (粉红色) - 负面情感词汇
- **旅游要素** (橙色) - 旅游相关要素
- **拓展要素** (浅橙色) - 其他相关要素

## 本地运行

```bash
# 克隆项目
git clone https://github.com/yourusername/semantic-network-generator.git

# 进入项目目录
cd semantic-network-generator

# 启动本地服务器
python -m http.server 3000

# 访问 http://localhost:3000
```

## 部署到Vercel

### 方法1: 通过Git自动部署

1. 将代码推送到GitHub
2. 在Vercel中连接GitHub仓库
3. 自动部署完成

### 方法2: 使用Vercel CLI

```bash
# 安装Vercel CLI
npm i -g vercel

# 部署
vercel

# 生产环境部署
vercel --prod
```

## 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **数据处理**: SheetJS (xlsx)
- **可视化**: ECharts 5.x
- **部署**: Vercel
- **版本控制**: Git

## 项目结构

```
semantic-network-generator/
├── index.html          # 主页面
├── sample-data.html    # 示例数据生成页面
├── vercel.json         # Vercel配置
├── package.json        # 项目配置
├── .gitignore         # Git忽略文件
└── README.md          # 项目说明
```

## 开发计划

- [ ] 支持更多文件格式 (CSV, JSON)
- [ ] 添加图表样式自定义
- [ ] 支持数据过滤和搜索
- [ ] 添加图表分析功能
- [ ] 支持多语言界面

## 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

- 项目地址: [GitHub](https://github.com/yourusername/semantic-network-generator)
- 问题反馈: [Issues](https://github.com/yourusername/semantic-network-generator/issues)

---

⭐ 如果这个项目对你有帮助，请给个Star支持一下！ # semanticNetworkGraphGenerator
