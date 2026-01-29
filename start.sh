#!/bin/bash

# C语言教学网站启动脚本

echo "=================================="
echo "   C语言程序设计教学网站"
echo "=================================="
echo ""
echo "正在启动本地服务器..."
echo ""

# 检查Python版本
if command -v python3 &> /dev/null; then
    echo "✓ 使用 Python 3"
    echo ""
    echo "服务器地址："
    echo "  主页: http://localhost:8000"
    echo "  案例: http://localhost:8000/pages/cases.html"
    echo ""
    echo "按 Ctrl+C 停止服务器"
    echo ""
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "✓ 使用 Python 2"
    echo ""
    echo "服务器地址："
    echo "  主页: http://localhost:8000"
    echo "  案例: http://localhost:8000/pages/cases.html"
    echo ""
    echo "按 Ctrl+C 停止服务器"
    echo ""
    python -m SimpleHTTPServer 8000
else
    echo "✗ 错误：未找到 Python"
    echo ""
    echo "请安装 Python 或直接用浏览器打开 index.html 文件"
    exit 1
fi
