#!/bin/bash

# C语言教学网站 - 二级目录配置脚本
# 用途：将网站配置为在二级目录中运行

echo "=================================="
echo "  C语言教学网站 - 二级目录配置"
echo "=================================="
echo ""
echo "此脚本将："
echo "1. 切换到简约版样式"
echo "2. 配置相对路径链接"
echo "3. 优化文件结构"
echo ""

# 检测是否在正确目录
if [ ! -f "index.html" ] && [ ! -d "pages" ]; then
    echo "❌ 错误：请在网站根目录运行此脚本"
    exit 1
fi

# 询问二级目录路径
echo "请输入二级目录路径（示例）："
echo "  如果是根目录部署，直接按回车"
echo "  如果是 /c-course，输入：c-course"
echo "  如果是 /learning/c，输入：learning/c"
read -p "> " BASE_PATH

# 处理路径
if [ -z "$BASE_PATH" ]; then
    BASE_PATH=""
    echo "配置为：根目录模式"
else
    # 移除开头的 /
    BASE_PATH=$(echo "$BASE_PATH" | sed 's/^\///')
    echo "配置为：二级目录模式 (/$BASE_PATH)"
fi

echo ""
echo "正在配置..."
echo ""

# 备份原文件
echo "1️⃣  备份原文件..."
BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r pages css/*.css index.html "$BACKUP_DIR/" 2>/dev/null
echo "   ✓ 备份完成：$BACKUP_DIR"

# 切换到简约版CSS
echo ""
echo "2️⃣  切换到简约版样式..."
for file in index.html pages/*.html; do
    if [ -f "$file" ]; then
        sed -i 's|css/main.css|css/main-simple.css|g' "$file"
    fi
done
echo "   ✓ 已切换到简约版样式"

# 配置链接路径
echo ""
echo "3️⃣  配置链接路径..."

if [ -z "$BASE_PATH" ]; then
    # 根目录模式：移除开头的 /
    echo "   配置为根目录模式（移除链接前缀 /）"
    for file in index.html pages/*.html; do
        if [ -f "$file" ]; then
            sed -i 's|href="/pages/|href="pages/|g' "$file"
            sed -i 's|src="/css/|src="css/|g' "$file"
        fi
    done
else
    # 二级目录模式：添加路径前缀
    echo "   配置为二级目录模式（添加前缀 /$BASE_PATH）"
    for file in index.html pages/*.html; do
        if [ -f "$file" ]; then
            sed -i "s|href=\"pages/|href=\"/$BASE_PATH/pages/|g" "$file"
            sed -i "s|href=\"/pages/|href=\"/$BASE_PATH/pages/|g" "$file"
            sed -i "s|src=\"/css/|src=\"/$BASE_PATH/css/|g" "$file"
        fi
    done
fi

echo "   ✓ 链接配置完成"

# 创建 .htaccess 文件（Apache）
if [ ! -z "$BASE_PATH" ]; then
    echo ""
    echo "4️⃣  创建 .htaccess 文件..."
    cat > .htaccess << EOF
# 启用重写引擎
RewriteEngine On

# 如果目录存在，直接访问
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# 重写规则
RewriteRule ^(.*)$ index.html [L,QSA]
EOF
    echo "   ✓ .htaccess 文件已创建"
fi

# 完成
echo ""
echo "=================================="
echo "          ✅ 配置完成！"
echo "=================================="
echo ""
echo "配置摘要："
echo "  样式：简约版"
echo "  路径模式：${BASE_PATH:-根目录}"
echo "  备份位置：$BACKUP_DIR"
echo ""
echo "测试方法："
if [ -z "$BASE_PATH" ]; then
    echo "  python3 -m http.server 8000"
    echo "  访问：http://localhost:8000"
else
    echo "  需要将文件部署到服务器 /$BASE_PATH 目录"
    echo "  或使用本地测试："
    echo "  cd .. && python3 -m http.server 8000"
    echo "  访问：http://localhost:8000/$BASE_PATH"
fi
echo ""
echo "恢复备份："
echo "  cp -r $BACKUP_DIR/* ."
echo ""
