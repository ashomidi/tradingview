let currentInterval = '15m';

document.getElementById('button15').addEventListener('click', () => {
    updateChart('15m');
});

document.getElementById('button30').addEventListener('click', () => {
    updateChart('30m');
});

document.getElementById('button1h').addEventListener('click', () => {
    updateChart('60m');
});

document.getElementById('button4h').addEventListener('click', () => {
    updateChart('4h');
});

const chartOptions = {
    height: 400,
    layout: {
        background: { color: '#252525' },
        textColor: '#DDD',
    },
    grid: {
        vertLines: { color: '#2b2b2b' },
        horzLines: { color: '#2b2b2b' },
    },
    timeScale: {
        timeVisible: true,
        secondsVisible: false,
    },
}

const btns = document.querySelectorAll('.time-interval-button');
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
        var current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
    });
}

async function fetchData() {
    try {
        const response = await fetch(`https://api.mexc.com/api/v3/klines?symbol=BTCUSDT&interval=${currentInterval}&limit=8`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

async function updateChart(newInterval) {
    currentInterval = newInterval;

    const rawData = await fetchData();

    if (!rawData) {
        return;
    }

    const closeData = rawData.map(item => ({
        time: item[0] / 1000,
        value: parseFloat(item[4]),
    }));

    const chartContainer = document.getElementById("chart-container");
    chartContainer.innerHTML = '';

    const chart = LightweightCharts.createChart(chartContainer, chartOptions);
    const lineSeries = chart.addAreaSeries();
    lineSeries.setData(closeData);
    chart.timeScale().fitContent();
}

updateChart(currentInterval);
