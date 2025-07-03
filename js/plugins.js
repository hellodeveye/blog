document.addEventListener('DOMContentLoaded', function() {
    // 图片懒加载
    const images = document.querySelectorAll('.post-content img');
    images.forEach(img => {
        img.setAttribute('loading', 'lazy');
    });

     // 深色模式切换
     const themeToggle = document.getElementById('theme-toggle');
     const darkIcon = document.getElementById('theme-toggle-dark-icon');
     const lightIcon = document.getElementById('theme-toggle-light-icon');
     
     // 初始化图标显示
     function updateThemeIcons() {
         if (document.documentElement.classList.contains('dark')) {
             darkIcon.classList.add('hidden');
             lightIcon.classList.remove('hidden');
         } else {
             darkIcon.classList.remove('hidden');
             lightIcon.classList.add('hidden');
         }
     }
     
     updateThemeIcons();
     
     if (themeToggle) {
         themeToggle.addEventListener('click', function() {
             if (document.documentElement.classList.contains('dark')) {
                 document.documentElement.classList.remove('dark');
                 localStorage.theme = 'light';
             } else {
                 document.documentElement.classList.add('dark');
                 localStorage.theme = 'dark';
             }
             updateThemeIcons();
         });
     }
     
     // 移动端菜单切换
     const mobileMenuButton = document.getElementById('mobile-menu-button');
     const mobileMenu = document.getElementById('mobile-menu');
     
     if (mobileMenuButton && mobileMenu) {
         mobileMenuButton.addEventListener('click', function() {
             mobileMenu.classList.toggle('hidden');
         });
     }
     
     // 回到顶部按钮
     const backToTopButton = document.getElementById('back-to-top');
     
     if (backToTopButton) {
         window.addEventListener('scroll', function() {
             if (window.pageYOffset > 300) {
                 backToTopButton.classList.remove('opacity-0', 'invisible');
                 backToTopButton.classList.add('opacity-100', 'visible');
             } else {
                 backToTopButton.classList.add('opacity-0', 'invisible');
                 backToTopButton.classList.remove('opacity-100', 'visible');
             }
         });
         
         backToTopButton.addEventListener('click', function() {
             window.scrollTo({
                 top: 0,
                 behavior: 'smooth'
             });
         });
     }

    // 初始化所有代码块 - 处理Hexo的figure.highlight结构
    document.querySelectorAll('figure.highlight').forEach(function(figure, index) {
        // 获取语言信息
        const language = getLanguageFromClass(figure.className) || 'text';
        
        // 如果是 mermaid，特殊处理
        if (language === 'mermaid') {
            // 处理 Mermaid 代码块
            const codeLineElements = figure.querySelectorAll('td.code .line');
            const lines = Array.from(codeLineElements).map(line => line.textContent);
            const mermaidCode = lines.join('\n');
            
            // 创建 Mermaid 容器
            const mermaidContainer = document.createElement('div');
            mermaidContainer.className = 'mermaid';
            mermaidContainer.textContent = mermaidCode;
            
            // 替换原来的代码块
            figure.parentNode.replaceChild(mermaidContainer, figure);
            return; // 跳过普通代码块处理
        }
        
        // 创建代码块容器
        const codeContainer = document.createElement('div');
        codeContainer.className = 'modern-code-block';
        
        // 创建头部
        const header = document.createElement('div');
        header.className = 'code-header';
        header.innerHTML = `
            <div class="code-header-left">
                <button class="code-collapse-btn" data-index="${index}">
                    <svg viewBox="0 0 16 16" fill="currentColor">
                        <path d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z"/>
                    </svg>
                </button>
                <div class="code-language">${getLanguageDisplay(language)}</div>
            </div>
            <div class="code-header-right">
                <button class="code-wrap-btn code-format-btn">
                    <svg viewBox="0 0 16 16" fill="currentColor" style="width: 12px; height: 12px;">
                        <path d="M2 4.75A.75.75 0 0 1 2.75 4h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2 8a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5A.75.75 0 0 1 2 8Zm0 3.25a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 0 1.5h-3.5a.75.75 0 0 1-.75-.75Z"/>
                    </svg>
                    <span>自动换行</span>
                </button>
                <button class="code-copy-btn" data-index="${index}">
                    <svg viewBox="0 0 16 16" fill="currentColor" style="width: 12px; height: 12px;">
                        <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"/>
                        <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"/>
                    </svg>
                    <span>复制</span>
                </button>
            </div>
        `;
        
        // 创建代码内容区域
        const codeContent = document.createElement('div');
        codeContent.className = 'code-content';
        
        // 处理代码内容 - 从Hexo的table结构中提取
        const codeLineElements = figure.querySelectorAll('td.code .line');
        const lineNumberElements = figure.querySelectorAll('td.gutter .line');
        
        const lines = Array.from(codeLineElements).map(line => line.textContent || '');
        const originalLineNumbers = Array.from(lineNumberElements).map(line => line.textContent || '');
        const codeText = lines.join('\n');
        
        // 创建行号和代码行
        const lineNumbers = document.createElement('div');
        lineNumbers.className = 'line-numbers';
        
        const codeLinesContainer = document.createElement('div');
        codeLinesContainer.className = 'code-lines';
        
        // 直接使用Hexo原始的行号和代码行一一对应
        lines.forEach((line, index) => {
            // 使用原始行号
            const lineNumber = document.createElement('div');
            lineNumber.className = 'line-number';
            lineNumber.textContent = originalLineNumbers[index] || (index + 1);
            lineNumbers.appendChild(lineNumber);
            
            // 代码行
            const codeLine = document.createElement('div');
            codeLine.className = 'code-line';
            // 确保空行也显示为一个空格以保持行高
            codeLine.textContent = line === '' ? ' ' : line;
            codeLinesContainer.appendChild(codeLine);
        });
        
        codeContent.appendChild(lineNumbers);
        codeContent.appendChild(codeLinesContainer);
        
        // 组装代码块
        codeContainer.appendChild(header);
        codeContainer.appendChild(codeContent);
        
        // 替换原始代码块
        figure.parentNode.replaceChild(codeContainer, figure);
        
        // 添加折叠功能
        const collapseBtn = codeContainer.querySelector('.code-collapse-btn');
        const codeContentEl = codeContainer.querySelector('.code-content');
        let isCollapsed = false;
        
        collapseBtn.addEventListener('click', function() {
            isCollapsed = !isCollapsed;
            const svg = collapseBtn.querySelector('svg');
            
            if (isCollapsed) {
                codeContentEl.style.display = 'none';
                svg.style.transform = 'rotate(0deg)';
            } else {
                codeContentEl.style.display = 'flex';
                svg.style.transform = 'rotate(90deg)';
            }
        });
        
        // 初始状态为展开
        collapseBtn.querySelector('svg').style.transform = 'rotate(90deg)';
        
        // 添加自动换行功能
        const wrapBtn = codeContainer.querySelector('.code-wrap-btn'); // 自动换行按钮
        const codeLines = codeContainer.querySelector('.code-lines');
        let isWrapped = false;
        
        wrapBtn.addEventListener('click', function() {
            isWrapped = !isWrapped;
            const allCodeLines = codeContainer.querySelectorAll('.code-line');
            const isDarkMode = document.documentElement.classList.contains('dark');
            const wrapText = wrapBtn.querySelector('span');
            
            if (isWrapped) {
                allCodeLines.forEach(line => {
                    line.style.whiteSpace = 'pre-wrap';
                    line.style.wordBreak = 'break-word';
                    // 自动换行时使用最小高度而不是固定高度
                    line.style.height = 'auto';
                    line.style.minHeight = '1.4em';
                });
                codeLines.style.overflowX = 'visible';
                // 根据主题设置激活状态背景色
                if (isDarkMode) {
                    wrapBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                } else {
                    wrapBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.08)';
                }
                wrapBtn.classList.add('active');
                wrapText.textContent = '取消自动换行';
            } else {
                allCodeLines.forEach(line => {
                    line.style.whiteSpace = 'pre';
                    line.style.wordBreak = 'normal';
                    // 恢复固定行高
                    line.style.height = '1.4em';
                    line.style.minHeight = '';
                });
                codeLines.style.overflowX = 'auto';
                wrapBtn.style.backgroundColor = 'transparent';
                wrapBtn.classList.remove('active');
                wrapText.textContent = '自动换行';
            }
        });
        
        // 添加复制功能
        const copyBtn = codeContainer.querySelector('.code-copy-btn');
        copyBtn.addEventListener('click', function() {
            const textToCopy = codeText;
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(textToCopy).then(function() {
                    showCopySuccess(copyBtn);
                });
            } else {
                // 降级方案
                const textArea = document.createElement('textarea');
                textArea.value = textToCopy;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showCopySuccess(copyBtn);
            }
        });
    });
    
    function getLanguageFromClass(className) {
        if (!className) return null;
        // Hexo使用 highlight 后跟语言名称的格式
        const match = className.match(/highlight\s+(\w+)/);
        return match ? match[1] : null;
    }
    
    function getLanguageDisplay(lang) {
        const langMap = {
            'javascript': 'JavaScript',
            'js': 'JavaScript',
            'typescript': 'TypeScript',
            'ts': 'TypeScript',
            'python': 'Python',
            'py': 'Python',
            'java': 'Java',
            'cpp': 'C++',
            'c': 'C',
            'csharp': 'C#',
            'cs': 'C#',
            'html': 'HTML',
            'css': 'CSS',
            'scss': 'SCSS',
            'sass': 'Sass',
            'json': 'JSON',
            'xml': 'XML',
            'yaml': 'YAML',
            'yml': 'YAML',
            'sql': 'SQL',
            'bash': 'Bash',
            'shell': 'Shell',
            'sh': 'Shell',
            'powershell': 'PowerShell',
            'ps1': 'PowerShell',
            'go': 'Go',
            'rust': 'Rust',
            'php': 'PHP',
            'ruby': 'Ruby',
            'swift': 'Swift',
            'kotlin': 'Kotlin',
            'dart': 'Dart',
            'text': 'Text',
            'txt': 'Text'
        };
        return langMap[lang.toLowerCase()] || lang.toUpperCase();
    }
    
    function showCopySuccess(button) {
        const span = button.querySelector('span');
        const originalText = span.textContent;
        span.textContent = '已复制';
        button.classList.add('copied');
        
        setTimeout(function() {
            span.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
    }
}); 