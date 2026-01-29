#!/bin/bash

echo "开始部署到 GitHub Pages..."

# 切换到 main 分支
git checkout main

# 删除旧的 gh-pages 分支（如果存在）
git branch -D gh-pages 2>/dev/null

# 使用 git subtree 推送到 gh-pages 分支
git subtree push --prefix . origin gh-pages --force

# 如果上面的命令失败，使用备用方法
if [ $? -ne 0 ]; then
    echo "使用备用方法..."
    git checkout -b gh-pages
    git add .
    git commit -m "Deploy"
    git push origin gh-pages --force
    git checkout main
    git branch -D gh-pages
fi

echo ""
echo "=========================================="
echo "✅ 部署完成！"
echo "=========================================="
echo ""
echo "网站地址："
echo "  https://caoronglin.github.io/nwafu-c-learn/"
echo ""
echo "注意：GitHub Pages 可能需要 1-2 分钟来更新"
echo "=========================================="
