// ==========================================================================
//   CGN Framework Web App - JavaScript Interactions & Charts (v2.0)
//   ==========================================================================

/**
 * Robust initialization to handle potential CDN delays or loading issues.
 */
const initApp = () => {
    console.log('CGN Web App: Initializing Premium v2.0...');

    // 1. Scroll Animations (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in, .slide-up');
    animatedElements.forEach(el => observer.observe(el));

    // 2. Chart Initialization with Fallback
    const tryInitCharts = (retries = 5) => {
        if (typeof Chart !== 'undefined') {
            setupCharts();
        } else if (retries > 0) {
            console.warn(`Chart.js not found. Retrying... (${retries} left)`);
            setTimeout(() => tryInitCharts(retries - 1), 1000);
        } else {
            console.error('Failed to load Chart.js after multiple attempts.');
            // Fallback UI or message
            document.querySelectorAll('.canvas-container').forEach(container => {
                container.innerHTML = '<div class="glass" style="height:100%; display:flex; align-items:center; justify-content:center; color:var(--text-secondary);">Visualization requires internet connection (Chart.js CDN).</div>';
            });
        }
    };

    tryInitCharts();

    // 3. Smooth Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // 4. Navbar Dynamic Styling
    const handleScroll = () => {
        const nav = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            nav.style.padding = '0.75rem 2.5rem';
            nav.style.background = 'rgba(15, 23, 42, 0.95)';
            nav.style.borderBottom = '1px solid var(--cgn-gold)';
        } else {
            nav.style.padding = '1rem 2.5rem';
            nav.style.background = 'var(--glass-bg)';
            nav.style.borderBottom = '1px solid var(--glass-border)';
        }
    };
    window.addEventListener('scroll', handleScroll);

    // 5. Interactive Pillar Toggles
    document.querySelectorAll('.learn-more').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.pillar-card');
            const isExpanding = !card.classList.contains('expanded');
            card.classList.toggle('expanded');
            
            btn.innerHTML = card.classList.contains('expanded') 
                ? 'Show Less <i class="ph ph-caret-up"></i>' 
                : 'Learn More <i class="ph ph-caret-down"></i>';

            // Trigger MathJax typesetting if expanding to ensure LaTeX renders
            if (isExpanding && window.MathJax) {
                MathJax.typesetPromise([card]).catch((err) => console.log('MathJax error:', err));
            }
        });
    });
};

// Global chart references for interactivity
let usdChart, tippingChart;

/**
 * Chart Setup Logic
 */
function setupCharts() {
    // Shared Chart Style
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(15, 23, 42, 0.9)';
    Chart.defaults.plugins.tooltip.padding = 12;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;

    // --- Chart 1: USD Reserve Share ---
    const usdCtx = document.getElementById('usdShareChart');
    if (usdCtx) {
        const years = [1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
        const usdShare = [71.2, 70.5, 70.1, 66.9, 65.8, 65.0, 66.5, 65.4, 63.9, 64.1, 62.1, 61.8, 62.6, 61.2, 61.0, 63.1, 65.3, 65.0, 62.7, 61.9, 60.8, 59.0, 58.8, 58.4, 58.1, 57.9];
        
        usdChart = new Chart(usdCtx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [
                    {
                        label: 'USD Reserve Share (%)',
                        data: usdShare,
                        borderColor: '#0054a6',
                        backgroundColor: 'rgba(0, 84, 166, 0.1)',
                        borderWidth: 4,
                        tension: 0.4,
                        fill: true,
                        pointRadius: 2,
                        pointHoverRadius: 8
                    },
                    {
                        label: 'Tipping Point (τ = 42%)',
                        data: Array(years.length).fill(42.0),
                        borderColor: '#c4941d',
                        borderWidth: 2,
                        borderDash: [10, 5],
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { min: 40, max: 80, grid: { color: 'rgba(255,255,255,0.05)' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    // --- Chart 2: Structural Tipping Point Decay ---
    const tippingCtx = document.getElementById('tippingPointChart');
    const slider = document.getElementById('centralitySlider');
    const sliderVal = document.getElementById('simulatorValue');

    if (tippingCtx) {
        const xData = [];
        const yData = [];
        for (let i = 0.05; i <= 1.0; i += 0.05) {
            xData.push(i.toFixed(2));
            yData.push(0.62 * Math.exp(0.35 * i) / Math.exp(0.35));
        }

        tippingChart = new Chart(tippingCtx, {
            type: 'line',
            data: {
                labels: xData,
                datasets: [{
                    data: yData,
                    borderColor: (ctx) => {
                        const {chartArea} = ctx.chart;
                        if (!chartArea) return '#0054a6';
                        const gradient = ctx.chart.ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
                        gradient.addColorStop(0, '#b42323');
                        gradient.addColorStop(0.42, '#b42323');
                        gradient.addColorStop(0.42, '#0054a6');
                        gradient.addColorStop(1, '#0054a6');
                        return gradient;
                    },
                    borderWidth: 5,
                    tension: 0.4,
                    pointRadius: (ctx) => {
                        const val = parseFloat(xData[ctx.dataIndex]);
                        const currentSlider = parseFloat(slider.value);
                        return Math.abs(val - currentSlider) < 0.02 ? 10 : 4;
                    },
                    pointBackgroundColor: (ctx) => {
                        const val = parseFloat(xData[ctx.dataIndex]);
                        const currentSlider = parseFloat(slider.value);
                        if (Math.abs(val - currentSlider) < 0.02) return '#fff';
                        return val <= 0.42 ? '#b42323' : '#0054a6';
                    },
                    pointBorderWidth: (ctx) => {
                        const val = parseFloat(xData[ctx.dataIndex]);
                        const currentSlider = parseFloat(slider.value);
                        return Math.abs(val - currentSlider) < 0.02 ? 4 : 0;
                    },
                    pointBorderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { min: 0, max: 1.1, grid: { color: 'rgba(255,255,255,0.05)' } },
                    x: { title: { display: true, text: 'Network Centrality (C)' }, grid: { display: false } }
                }
            }
        });

        // Simulator Logic
        slider.addEventListener('input', () => {
            const val = parseFloat(slider.value).toFixed(2);
            sliderVal.innerText = `Centrality: ${val}`;
            sliderVal.className = val <= 0.42 ? 'text-red pulse' : 'text-blue';
            tippingChart.update();
        });
    }
}

// Start App on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
