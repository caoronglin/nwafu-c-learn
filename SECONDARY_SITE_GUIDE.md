# C语言教学网站 - 二级界面部署指南

本指南说明如何将C语言教学网站作为二级目录部署到现有网站中。

## 📁 目录结构建议

### 方案1：作为网站子目录

```
your-website/
├── index.html           (主站首页)
├── about.html
├── c-course/           ← C语言教程放在这里
│   ├── index.html
│   ├── css/
│   │   ├── main.css
│   │   └── prism.css
│   └── pages/
│       ├── c-keywords.html
│       ├── chapter2.html
│       └── ...
└── other-content/
```

### 方案2：独立子域名

```
c.yourdomain.com/       ← 直接指向 c-course 文件夹
├── index.html
├── css/
└── pages/
```

## ⚙️ 链接配置

### 1. 相对路径（推荐）

如果你的网站部署在二级目录（如 `yourdomain.com/c-course/`），所有链接都需要修改为相对路径。

**当前状态：** 使用绝对路径 `/pages/xxx.html`

**需要改为：** 使用相对路径 `pages/xxx.html`

### 2. 批量修改链接

创建一个脚本来自动修改所有HTML文件中的链接：

```bash
#!/bin/bash
# fix-links.sh

# 查找所有HTML文件中的链接并修改
find pages/ -name "*.html" -exec sed -i 's|href="/pages/|href="pages/|g' {} \;
find . -maxdepth 1 -name "*.html" -exec sed -i 's|href="/pages/|href="pages/|g' {} \;

echo "链接已修改为相对路径"
```

### 3. CSS选择

在HTML `<head>` 中选择使用哪个CSS文件：

**简约版（推荐）：**
```html
<link rel="stylesheet" href="/c-course/css/main-simple.css">
```

**标准版：**
```html
<link rel="stylesheet" href="/c-course/css/main.css">
```

## 🔄 两种部署模式

### 模式A：绝对路径模式（独立部署）

如果C教程有自己的域名或独立路径：

```html
<!-- 保持当前链接不变 -->
<link href="/css/main.css">
<a href="/pages/chapter2.html">
```

**适用场景：**
- 独立域名：`c.yourdomain.com`
- 独立路径：`yourdomain.com/c/`

### 模式B：相对路径模式（二级目录）

如果作为主站的一部分：

```html
<!-- 修改为相对路径 -->
<link href="css/main.css">
<a href="pages/chapter2.html">
```

**适用场景：**
- 主站下：`yourdomain.com/learning/c/`
- 子目录：`yourdomain.com/docs/c/`

## 🛠️ 快速部署脚本

### Linux/Mac

```bash
#!/bin/bash
# deploy-as-secondary.sh

echo "=== C语言教程 - 二级目录部署 ==="
echo ""
echo "请输入你的二级目录路径（如：/c-course）："
read BASE_PATH

# 如果路径不以 / 开头，添加 /
if [[ ! $BASE_PATH == /* ]]; then
    BASE_PATH="/$BASE_PATH"
fi

echo "正在配置链接为：$BASE_PATH"

# 修改所有HTML文件中的链接
find . -name "*.html" -type f -exec sed -i "s|href=\"/pages/|href=\"$BASE_PATH/pages/|g" {} \;
find . -name "*.html" -type f -exec sed -i "s|href=\"/css/|href=\"$BASE_PATH/css/|g" {} \;

# 修改CSS引用
find . -name "*.html" -type f -exec sed -i "s|css/main.css|css/main-simple.css|g" {} \;

echo ""
echo "✅ 配置完成！"
echo "链接前缀：$BASE_PATH"
echo "样式：简约版"
```

### Windows PowerShell

```powershell
# deploy-as-secondary.ps1

$basePath = Read-Host "请输入二级目录路径（如：/c-course）"

# 修改HTML链接
Get-ChildItem -Recurse -Filter "*.html" | ForEach-Object {
    (Get-Content $_.FullName) -replace 'href="/pages/', "href=`"$basePath/pages/" | Set-Content $_.FullName
    (Get-Content $_.FullName) -replace 'css/main.css', 'css/main-simple.css' | Set-Content $_.FullName
}

Write-Host "✅ 配置完成！"
```

## 📋 部署检查清单

部署前请检查：

- [ ] 确定部署路径（独立还是二级目录）
- [ ] 选择CSS样式（简约版 main-simple.css 或 标准版 main.css）
- [ ] 修改所有链接为正确的路径格式
- [ ] 测试导航链接是否正常工作
- [ ] 测试代码高亮是否显示
- [ ] 检查移动端显示效果

## 🌐 Nginx 配置示例

### 配置二级目录

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # 主站
    location / {
        root /var/www/main-site;
        index index.html;
    }

    # C语言教程（二级目录）
    location /c-course {
        alias /var/www/c-course;
        index index.html;
        try_files $uri $uri/ /c-course/index.html;
    }
}
```

### 配置子域名

```nginx
server {
    listen 80;
    server_name c.yourdomain.com;

    root /var/www/c-course;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🔗 主站导航集成

在主站首页添加C语言教程的入口：

```html
<!-- 方案1：直接链接 -->
<a href="/c-course/">C语言程序设计</a>

<!-- 方案2：新窗口打开 -->
<a href="/c-course/" target="_blank">C语言程序设计 ↗</a>

<!-- 方案3：卡片样式 -->
<div class="course-card">
    <h3>C语言程序设计</h3>
    <p>从零基础到高级应用</p>
    <a href="/c-course/" class="btn">开始学习 →</a>
</div>
```

## 🎨 样式定制

### 使用简约版样式（推荐）

在所有HTML文件中替换：

```html
<!-- 原版 -->
<link rel="stylesheet" href="/css/main.css">

<!-- 改为 -->
<link rel="stylesheet" href="/css/main-simple.css">
```

### 自定义主题色

在 `main-simple.css` 中修改：

```css
:root {
    --primary-color: #0066cc;  /* 主色调 */
    --text-color: #333333;      /* 文字颜色 */
    --bg-secondary: #f5f5f5;    /* 背景色 */
}
```

## 📊 文件大小对比

| 文件 | 标准版 | 简约版 | 节省 |
|------|--------|--------|------|
| main.css | ~15KB | ~9KB | 40% |
| 加载时间 | ~50ms | ~30ms | 40% |

## 🚀 一键部署命令

```bash
# 克隆或下载
git clone <repo-url>
cd website

# 方式1：作为独立站点（开发测试）
python3 -m http.server 8000
# 访问：http://localhost:8000

# 方式2：配置为二级目录
chmod +x deploy-as-secondary.sh
./deploy-as-secondary.sh
# 输入路径：/learning/c

# 方式3：直接复制到服务器
scp -r * user@server:/var/www/html/c-course/
```

## 📝 维护说明

### 更新内容时

1. 修改或添加新的HTML文件
2. 确保链接使用正确的路径格式
3. 运行测试确保没有断链

### 添加新页面时

```html
<!-- 使用相对路径 -->
<nav class="sidebar-nav">
    <div class="nav-section">
        <h3>新章节</h3>
        <ul>
            <li><a href="pages/new-chapter.html" class="active">新章节</a></li>
        </ul>
    </div>
</nav>
```

## 🆘 常见问题

### Q1：链接点击404

**原因：** 路径配置错误

**解决：** 检查是否使用了正确的路径格式（绝对 vs 相对）

### Q2：CSS样式不生效

**原因：** CSS路径错误

**解决：** 确认 `<link>` 标签中的CSS文件路径正确

### Q3：侧边栏不显示

**原因：** 移动端或窗口太小

**解决：** 增加窗口宽度，或检查CSS媒体查询

### Q4：代码不换行

**原因：** `overflow-x` 设置

**解决：** 检查 `<pre>` 标签的样式

## 📞 技术支持

如有问题，请检查：

1. 浏览器控制台是否有错误
2. 网络请求是否成功（F12 → Network）
3. 文件路径是否正确

---

**最后更新：** 2026年1月
**版本：** 2.0（简约版）
**适用于：** 二级目录部署
