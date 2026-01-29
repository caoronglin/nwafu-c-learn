/**
 * 滑动阻尼效果 - Smooth Scroll Damping
 * 参考：https://meuicat.com/posts/deefcce5.html
 */

(function() {
    'use strict';

    // 检查是否在移动端（屏幕宽度小于768px）
    function isMobile() {
        return document.body.clientWidth < 768;
    }

    // 初始化滑动阻尼效果
    function initSmoothScroll() {
        // 如果是移动端，使用CSS的 scroll-behavior: smooth
        if (isMobile()) {
            document.documentElement.style.scrollBehavior = 'smooth';
            return;
        }

        // 创建必要的DOM结构
        const body = document.body;
        const existingViewbox = document.querySelector('.smooth-viewbox');
        const existingScrollbox = document.querySelector('.smooth-scrollbox');

        // 如果已经初始化过，不再重复
        if (existingViewbox || existingScrollbox) {
            return;
        }

        // 将body内容包装到scrollbox中
        const scrollbox = document.createElement('div');
        scrollbox.className = 'smooth-scrollbox';

        // 创建viewbox
        const viewbox = document.createElement('div');
        viewbox.className = 'smooth-viewbox';

        // 将body的所有子元素移到scrollbox中
        while (body.firstChild) {
            scrollbox.appendChild(body.firstChild);
        }

        // 将scrollbox添加到viewbox中
        viewbox.appendChild(scrollbox);
        body.appendChild(viewbox);

        // 固定body高度
        function resizeBody() {
            const height = scrollbox.offsetHeight;
            body.style.height = `${height}px`;
        }

        // 滚动事件处理
        let scrollY = window.scrollY || window.pageYOffset;
        let currentScrollY = scrollY;
        let targetScrollY = scrollY;
        let isScrolling = false;

        function handleScroll() {
            targetScrollY = window.scrollY || window.pageYOffset;
            if (!isScrolling) {
                isScrolling = true;
                requestAnimationFrame(updateScroll);
            }
        }

        function updateScroll() {
            // 使用缓动公式实现平滑过渡
            const easing = 0.1;
            currentScrollY += (targetScrollY - currentScrollY) * easing;

            // 应用变换
            scrollbox.style.transform = `translateY(${-currentScrollY}px)`;

            // 继续动画直到接近目标值
            if (Math.abs(targetScrollY - currentScrollY) > 0.5) {
                requestAnimationFrame(updateScroll);
            } else {
                isScrolling = false;
            }
        }

        // 监听滚动事件
        let lastScrollY = 0;
        let ticking = false;

        function onScroll() {
            lastScrollY = window.scrollY || window.pageYOffset;
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    scrollbox.style.transform = `translateY(${-lastScrollY}px)`;
                    ticking = false;
                });
                ticking = true;
            }
        }

        // 使用更简单的滚动监听
        window.addEventListener('scroll', onScroll, { passive: true });

        // 监听窗口大小变化
        window.addEventListener('load', resizeBody);
        window.addEventListener('resize', resizeBody);

        // 初始化高度
        resizeBody();

        // 添加过渡效果
        scrollbox.style.transition = 'transform 0.3s ease-out';
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSmoothScroll);
    } else {
        initSmoothScroll();
    }

    // 窗口大小变化时重新初始化（切换移动/桌面模式）
    let lastWidth = window.innerWidth;
    window.addEventListener('resize', function() {
        const currentWidth = window.innerWidth;
        // 检测是否跨越了768px的阈值
        if ((lastWidth < 768 && currentWidth >= 768) ||
            (lastWidth >= 768 && currentWidth < 768)) {
            // 重新加载页面以应用正确的滚动模式
            location.reload();
        }
        lastWidth = currentWidth;
    });

})();
