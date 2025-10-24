# Pot-App 硅基流动 OCR 插件

基于 [硅基流动 API](https://siliconflow.cn/) 的 OCR 文字识别插件，支持 LaTeX 数学公式、Markdown 格式、验证码识别等场景。

## ✨ 功能特点

- 🧮 智能识别 LaTeX 数学公式（`$行内$` 和 `$$独立$$`）
- 📝 完整保留 Markdown 格式（代码块、表格、列表、引用等）
- 🔤 优化验证码识别（区分 0/O、1/l/I 等易混淆字符）
- 📋 表格自动转换为 Markdown 格式
- 🌍 支持多语言和手写文字识别
- ⚙️ 可自定义模型和提示词

## 📦 安装使用

### 1. 获取 API Key

访问 [硅基流动官网](https://siliconflow.cn/) 注册并获取 API Key（新用户有免费额度）

### 2. 安装插件

从 [Releases](https://github.com/pot-app/pot-app-recognize-plugin-Silicon-OCR/releases) 下载 `.potext` 文件，在 Pot-App 中选择 `偏好设置` → `插件` → `添加外部插件`

### 3. 配置插件

- **API Key**（必填）：填入硅基流动的 API Key
- **模型名称**（可选）：默认 `Qwen/Qwen3-VL-235B-A22B-Instruct`，可在[模型列表](https://siliconflow.cn/models)查看更多
- **自定义提示词**（可选）：自定义识别指令

## 🎯 默认识别能力

插件默认支持以下场景（无需额外配置）：

| 场景 | 说明 | 示例 |
|------|------|------|
| 数学公式 | LaTeX 格式输出 | `$x^2$` `$$\sum_{i=1}^n$$` |
| Markdown | 保留原始格式 | 标题、列表、代码块、表格等 |
| 验证码 | 自动识别 4-6 位字符 | 区分 0/O、1/l、2/Z 等 |
| 表格 | 转换为 Markdown 表格 | `\| 列1 \| 列2 \|` |
| 手写文字 | 尽可能识别 | 潦草文字 + 上下文推断 |
| 多列文本 | 按阅读顺序输出 | 左列 → 右列 |

## ⚙️ 手动打包

```bash
# 克隆仓库
git clone https://github.com/pot-app/pot-app-recognize-plugin-Silicon-OCR.git

# 将 main.js、info.json、icon.png 压缩为 zip
# 重命名为 plugin.com.pot-app.silicon-ocr.potext
```

## 📝 许可证

MIT License - 详见 [LICENSE](LICENSE)

## 🔗 相关链接

- [Pot-App](https://pot-app.com/) | [硅基流动](https://siliconflow.cn/) | [问题反馈](https://github.com/pot-app/pot-app-recognize-plugin-Silicon-OCR/issues)
