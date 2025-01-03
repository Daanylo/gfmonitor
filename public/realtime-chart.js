// Initialize global variable for the chart
let realtime_chart;

async function initializeRealtimeChart() {
    const canvas = document.getElementById('wattage-chart');
    const ctx = canvas.getContext('2d');

    if (realtime_chart) {
        realtime_chart.destroy();
    }

    // Create default labels from '30' to 'now'
    const labels = Array.from({ length: 31 }, (_, i) => (i === 30 ? 'Now' : `${30 - i}`));

    realtime_chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels, // Use default labels initially
            datasets: [{
                label: 'Wattage (W)',
                data: Array(31).fill(0), // Initial empty data
                backgroundColor: 'white',
                hoverBackgroundColor: '#0d3840',
                borderWidth: 2,
                fill: true,
                tension: 0,
                pointRadius: 0,
            }]
        },
        options: {
            responsive: true,
            animation: false,
            color: '#f29f05',
            scales: {
                x: {
                    ticks: {
                        color: '#f29f05',
                    },
                    title: {
                        display: true,
                        color: 'white',
                        text: 'Seconds ago',
                    },
                    grid: {
                        display: false,
                    }
                },
                y: {
                    ticks: {
                        beginAtZero: true,
                        color: '#f29f05',
                        stepSize: 1,
                        callback: function(value) {
                            return value.toFixed(1);
                        }
                    },
                    title: {
                        display: true,
                        color: 'white',
                        text: 'Wattage (W)',
                    },
                    grid: {
                        display: false,
                    },
                    min: 0,
                    max: 50
                }
            },
            plugins: {
                legend: {
                    display: true,
                },
                tooltip: {
                    enabled: false,
                }
            }
        }
    });
    updateRealtimeChart();
}

function updateRealtimeChart() {
    const now = new Date();
    const shiftedTime = new Date(now - 2 * 1000); // Adjust time by 2 seconds

    // Default labels from '30' to 'Now'
    const labels = Array.from({ length: 31 }, (_, i) => (i === 30 ? 'Now' : `${30 - i}`));
    const data = Array(31).fill(0); // Initialize data with zeros

    if (reportData && reportData.length > 0) {

        // Update data based on actual report data
        for (let i = 0; i < 31; i++) {
            const dataForSecond = reportData.filter(row => {
                const rowTime = new Date(row.datetime);
                const secondsAgo = Math.floor((shiftedTime - rowTime) / 1000);
                return secondsAgo === (30 - i);
            });

            if (dataForSecond.length > 0) {
                const totalWattage = dataForSecond.reduce((sum, row) => sum + (row.voltage * row.amperage), 0);
                data[i] = totalWattage / dataForSecond.length;
            }
        }
    }
    // Update the chart data with the new values
    realtime_chart.data.labels = labels;
    realtime_chart.data.datasets[0].data = data;
    realtime_chart.update();
}