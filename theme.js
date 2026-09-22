(function () {
    const STORAGE_KEY = 'ml-geofisika-theme';
    let savedTheme = null;
    try {
        savedTheme = localStorage.getItem(STORAGE_KEY);
    } catch (error) {
        // Static file contexts may restrict storage; light mode remains usable.
    }
    const initialTheme = savedTheme === 'dark' ? 'dark' : 'light';

    document.documentElement.dataset.theme = initialTheme;

    function getThemeColor(name, fallback) {
        const value = getComputedStyle(document.documentElement)
            .getPropertyValue(name)
            .trim();
        return value || fallback;
    }

    window.getThemeColor = getThemeColor;

    function updateToggle(button) {
        const isDark = document.documentElement.dataset.theme === 'dark';
        button.innerHTML = isDark
            ? '<span aria-hidden="true">☀️</span><span class="theme-label">Light mode</span>'
            : '<span aria-hidden="true">🌙</span><span class="theme-label">Night mode</span>';
        button.setAttribute('aria-label', isDark ? 'Aktifkan light mode' : 'Aktifkan night mode');
        button.setAttribute('aria-pressed', String(isDark));
    }

    function refreshPlotly() {
        const plot = document.getElementById('plot');
        if (!window.Plotly || !plot || !plot.data) return;
        const isDark = document.documentElement.dataset.theme === 'dark';
        window.Plotly.relayout('plot', {
            paper_bgcolor: getThemeColor('--panel', isDark ? '#1f2937' : '#ffffff'),
            plot_bgcolor: getThemeColor('--panel', isDark ? '#1f2937' : '#ffffff'),
            font: { color: getThemeColor('--text', isDark ? '#e5e7eb' : '#1f2937') },
            'xaxis.gridcolor': getThemeColor('--border', isDark ? '#374151' : '#d5deea'),
            'yaxis.gridcolor': getThemeColor('--border', isDark ? '#374151' : '#d5deea'),
            'xaxis.zerolinecolor': getThemeColor('--text-muted', isDark ? '#9ca3af' : '#64748b'),
            'yaxis.zerolinecolor': getThemeColor('--text-muted', isDark ? '#9ca3af' : '#64748b')
        });
    }

    function refreshFdmCanvases() {
        ['drawElliptic', 'drawParabolicChart', 'drawHyperbolicChart'].forEach((name) => {
            if (typeof window[name] === 'function') window[name]();
        });
    }

    function installToggle() {
        if (document.querySelector('.theme-toggle')) return;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'theme-toggle';
        updateToggle(button);
        button.addEventListener('click', function () {
            const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
            document.documentElement.dataset.theme = nextTheme;
            try {
                localStorage.setItem(STORAGE_KEY, nextTheme);
            } catch (error) {
                // Theme still applies for the current page when storage is unavailable.
            }
            updateToggle(button);
            refreshPlotly();
            refreshFdmCanvases();
            document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: nextTheme } }));
        });
        document.body.appendChild(button);
    }

    document.addEventListener('DOMContentLoaded', function () {
        installToggle();
        refreshPlotly();
        refreshFdmCanvases();
    });

    window.addEventListener('load', refreshPlotly);
})();
