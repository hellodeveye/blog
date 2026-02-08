// Mermaid 初始化配置（官方主题：light=default / dark=dark，look=classic）
function getMermaidSource(text) {
    if (!text) return '';

    const normalized = text.trim();
    if (!normalized) return '';

    const lines = normalized
        .split(/\r?\n/)
        .map(function (line) { return line.trim(); })
        .filter(Boolean);

    if (!lines.length) return '';

    const firstMeaningfulLine = lines.find(function (line) {
        return !line.startsWith('%%');
    }) || '';

    if (!firstMeaningfulLine) return '';

    const startPattern = /^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram(?:-v2)?|erDiagram|journey|gantt|pie(?:\s+title)?|mindmap|timeline|gitGraph|quadrantChart|requirementDiagram|sankey-beta|xychart-beta|packet|kanban|architecture|block-beta|zenuml)\b/;
    return startPattern.test(firstMeaningfulLine) ? normalized : '';
}

async function initMermaid() {
    if (typeof mermaid === 'undefined') return;

    if (window.__mermaidThemeInitDone) return;
    window.__mermaidThemeInitDone = true;

    mermaid.startOnLoad = false;

    const mermaidBlocks = Array.from(document.querySelectorAll('.post-content .mermaid'));
    if (!mermaidBlocks.length) return;

    mermaidBlocks.forEach(function (block) {
        if (!block.dataset.mermaidSource) {
            const source = (block.textContent || '').trim();
            const mermaidSource = getMermaidSource(source);
            if (mermaidSource) {
                block.dataset.mermaidSource = mermaidSource;
            }
        }
    });

    async function renderMermaidByTheme() {
        const isDarkMode = document.documentElement.classList.contains('dark');

        mermaid.initialize({
            theme: isDarkMode ? 'dark' : 'default',
            look: 'classic',
            startOnLoad: false,
            securityLevel: 'loose',
            flowchart: {
                htmlLabels: true,
                curve: 'linear',
                useMaxWidth: true
            },
            sequence: {
                diagramMarginX: 50,
                diagramMarginY: 10,
                actorMargin: 50,
                width: 150,
                height: 65,
                boxMargin: 10,
                boxTextMargin: 5,
                noteMargin: 10,
                messageMargin: 35,
                mirrorActors: true,
                bottomMarginAdj: 1,
                useMaxWidth: true
            },
            class: {
                useMaxWidth: true
            },
            state: {
                useMaxWidth: true
            },
            gantt: {
                useMaxWidth: true
            },
            journey: {
                useMaxWidth: true
            }
        });

        mermaidBlocks.forEach(function (block) {
            block.removeAttribute('data-processed');
            const source = block.dataset.mermaidSource;
            if (source) {
                block.textContent = source;
            }
        });

        try {
            await mermaid.run({
                querySelector: '.post-content .mermaid[data-mermaid-source]'
            });
        } catch (error) {
            console.error('[mermaid] render failed:', error);
        }
    }

    await renderMermaidByTheme();

    let lastIsDark = document.documentElement.classList.contains('dark');
    const observer = new MutationObserver(function () {
        const isDark = document.documentElement.classList.contains('dark');
        if (isDark !== lastIsDark) {
            lastIsDark = isDark;
            renderMermaidByTheme();
        }
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMermaid, { once: true });
} else {
    initMermaid();
}
