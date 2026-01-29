/**
 * 本地搜索功能
 * 基于全文搜索，支持标题和内容搜索
 */

(function() {
    'use strict';

    // 页面数据索引
    let pageIndex = [];

    // 初始化搜索数据
    function initSearchData() {
        // 网站所有页面的列表
        const pages = [
            {
                url: '/index.html',
                title: 'C语言程序设计 - 首页',
                description: 'C语言是最重要、最流行的编程语言之一。本课程将系统地介绍C语言的各个方面。',
                keywords: ['C语言', '程序设计', '编程', '入门', '基础']
            },
            {
                url: '/pages/c-keywords.html',
                title: 'C语言32个关键字',
                description: '详细讲解C语言的32个关键字，包括数据类型、存储类型、控制语句等核心概念。',
                keywords: ['关键字', '数据类型', '变量', '函数', '控制语句']
            },
            {
                url: '/pages/main-function.html',
                title: 'main函数详解',
                description: '深入理解程序入口点main函数的作用、参数传递、返回值等重要概念。',
                keywords: ['main函数', '程序入口', '参数', '返回值', 'argc', 'argv']
            },
            {
                url: '/pages/chapter2.html',
                title: '第2章 C语言基础',
                description: '掌握C语言的基本数据类型、常量、变量、运算符和表达式等基础知识。',
                keywords: ['数据类型', '常量', '变量', '运算符', '表达式', '整型', '浮点型', '字符型']
            },
            {
                url: '/pages/chapter3.html',
                title: '第3章 程序设计基本结构',
                description: '学习顺序、选择、循环三种基本控制结构，掌握程序设计的逻辑基础。',
                keywords: ['顺序结构', '选择结构', '循环结构', 'if', 'switch', 'for', 'while', 'do-while']
            },
            {
                url: '/pages/chapter4.html',
                title: '第4章 数组',
                description: '理解数组的概念，掌握一维数组、二维数组的声明、初始化和使用方法。',
                keywords: ['数组', '一维数组', '二维数组', '字符串', '初始化']
            },
            {
                url: '/pages/chapter5.html',
                title: '第5章 指针',
                description: 'C语言的核心特性——指针。深入理解指针的概念、运算和实际应用。',
                keywords: ['指针', '地址', '指针变量', '指针运算', '指针数组', '函数指针']
            },
            {
                url: '/pages/chapter6.html',
                title: '第6章 函数',
                description: '学习模块化程序设计，掌握函数的定义、调用、参数传递和递归。',
                keywords: ['函数', '函数定义', '函数调用', '参数传递', '递归', '局部变量', '全局变量']
            },
            {
                url: '/pages/chapter7.html',
                title: '第7章 结构体与共用体',
                description: '掌握用户自定义数据类型，学习结构体、共用体和枚举的使用。',
                keywords: ['结构体', '共用体', '枚举', 'typedef', '自定义类型']
            },
            {
                url: '/pages/chapter8.html',
                title: '第8章 文件操作',
                description: '学习文件的打开、读写、关闭等操作，掌握数据持久化的方法。',
                keywords: ['文件', 'fopen', 'fclose', 'fread', 'fwrite', '文件指针', '文本文件', '二进制文件']
            },
            {
                url: '/pages/cases.html',
                title: '经典案例与解析',
                description: '通过经典案例深入理解C语言的各种特性和编程技巧。',
                keywords: ['案例', '实例', '练习', '项目', '应用']
            },
            {
                url: '/pages/exam-tips.html',
                title: '考试技巧与注意事项',
                description: 'C语言考试的重点、难点和答题技巧。',
                keywords: ['考试', '技巧', '重点', '难点', '复习']
            },
            {
                url: '/pages/interview-questions.html',
                title: 'C语言面试题集锦',
                description: '常见的C语言面试题目和解答，帮助准备技术面试。',
                keywords: ['面试', '面试题', '笔试', '题目']
            },
            {
                url: '/pages/sorting-algorithms.html',
                title: '排序算法详解',
                description: '详细讲解各种排序算法的原理和C语言实现。',
                keywords: ['排序', '冒泡排序', '选择排序', '插入排序', '快速排序', '算法']
            }
        ];

        pageIndex = pages;
    }

    // 搜索功能
    function search(query) {
        if (!query || query.trim() === '') {
            return [];
        }

        query = query.toLowerCase().trim();
        const results = [];

        pageIndex.forEach(page => {
            let score = 0;
            const titleLower = page.title.toLowerCase();
            const descLower = page.description.toLowerCase();

            // 标题匹配（权重高）
            if (titleLower.includes(query)) {
                score += 10;
                if (titleLower === query) score += 20;
            }

            // 关键词匹配
            page.keywords.forEach(keyword => {
                if (keyword.toLowerCase().includes(query)) {
                    score += 5;
                }
            });

            // 描述匹配
            if (descLower.includes(query)) {
                score += 2;
            }

            if (score > 0) {
                results.push({
                    ...page,
                    score: score
                });
            }
        });

        // 按相关度排序
        return results.sort((a, b) => b.score - a.score);
    }

    // 创建搜索UI
    function createSearchUI() {
        // 检查是否已存在
        if (document.querySelector('.search-container')) {
            return;
        }

        // 创建搜索按钮
        const searchBtn = document.createElement('button');
        searchBtn.className = 'search-toggle-btn';
        searchBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>';
        searchBtn.setAttribute('aria-label', '搜索');
        searchBtn.title = '站内搜索 (Ctrl+K)';

        // 创建搜索面板
        const searchPanel = document.createElement('div');
        searchPanel.className = 'search-panel';
        searchPanel.innerHTML = `
            <div class="search-overlay"></div>
            <div class="search-modal">
                <div class="search-header">
                    <div class="search-input-wrapper">
                        <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                        <input type="text" class="search-input" placeholder="搜索课程内容..." autocomplete="off">
                        <button class="search-clear" style="display: none;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div class="search-shortcut">ESC 关闭</div>
                </div>
                <div class="search-results"></div>
            </div>
        `;

        document.body.appendChild(searchBtn);
        document.body.appendChild(searchPanel);

        // 绑定事件
        const searchInput = searchPanel.querySelector('.search-input');
        const searchClear = searchPanel.querySelector('.search-clear');
        const searchResults = searchPanel.querySelector('.search-results');
        const searchOverlay = searchPanel.querySelector('.search-overlay');

        // 打开搜索
        function openSearch() {
            searchPanel.classList.add('active');
            searchInput.focus();
            document.body.style.overflow = 'hidden';
        }

        // 关闭搜索
        function closeSearch() {
            searchPanel.classList.remove('active');
            searchInput.value = '';
            searchResults.innerHTML = '';
            searchClear.style.display = 'none';
            document.body.style.overflow = '';
        }

        // 执行搜索
        function performSearch() {
            const query = searchInput.value;
            const results = search(query);

            if (results.length === 0) {
                searchResults.innerHTML = `
                    <div class="search-empty">
                        <p>未找到相关内容</p>
                        <p class="search-hint">尝试使用不同的关键词搜索</p>
                    </div>
                `;
            } else {
                let html = `<div class="search-count">找到 ${results.length} 个结果</div>`;
                html += '<div class="search-results-list">';

                results.forEach(result => {
                    html += `
                        <a href="${result.url}" class="search-result-item">
                            <div class="result-title">${highlightText(result.title, query)}</div>
                            <div class="result-description">${highlightText(result.description, query)}</div>
                        </a>
                    `;
                });

                html += '</div>';
                searchResults.innerHTML = html;
            }

            searchClear.style.display = query ? 'block' : 'none';
        }

        // 高亮搜索关键词
        function highlightText(text, query) {
            if (!query) return text;
            const regex = new RegExp(`(${query})`, 'gi');
            return text.replace(regex, '<mark>$1</mark>');
        }

        // 事件监听
        searchBtn.addEventListener('click', openSearch);
        searchOverlay.addEventListener('click', closeSearch);
        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            searchInput.focus();
            performSearch();
        });

        searchInput.addEventListener('input', performSearch);

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            // Ctrl+K 或 Cmd+K 打开搜索
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                openSearch();
            }
            // ESC 关闭搜索
            if (e.key === 'Escape' && searchPanel.classList.contains('active')) {
                closeSearch();
            }
        });

        // 点击搜索结果后关闭搜索面板
        searchResults.addEventListener('click', (e) => {
            const link = e.target.closest('.search-result-item');
            if (link) {
                closeSearch();
            }
        });
    }

    // 初始化
    function init() {
        initSearchData();
        createSearchUI();
    }

    // DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
