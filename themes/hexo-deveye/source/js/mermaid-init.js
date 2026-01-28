// Mermaid 初始化配置
window.addEventListener('load', function () {
    if (typeof mermaid !== 'undefined') {
        mermaid.initialize({
            theme: 'default',
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
    }
});
