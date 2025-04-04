import Chart from "chart.js/auto";

(async function () {
  const data = [
    { category: "Belanja", count: 30 },
    { category: "Kebutuhan Pokok", count: 25 },
    { category: "Transportasi", count: 20 },
    { category: "Transfer", count: 15 },
    { category: "Lainnya", count: 10 },
  ];

  new Chart(document.getElementById("pieChart"), {
    type: "doughnut",
    data: {
      labels: data.map((row) => row.category),
      datasets: [
        {
          label: "Pengeluaran Bulanan",
          data: data.map((row) => row.count),
          backgroundColor: [
            "#FF6384",  // Pink/Red for Belanja
            "#36A2EB",  // Blue for Kebutuhan Pokok
            "#FFCE56",  // Yellow for Transportasi
            "#4BC0C0",  // Teal for Transfer
            "#9966FF"   // Purple for Lainnya
          ],
          borderColor: "#1E293B",
          borderWidth: 2,
          hoverOffset: 15,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: true,
          position: "right",
          labels: {
            boxWidth: 15,
            font: {
              size: 12,
              family: "Inter, sans-serif",
              weight: "bold",
            },
            color: '#000000',
            padding: 20
          },
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((context.raw / total) * 100);
              return `${context.label}: ${context.raw} (${percentage}%)`;
            }
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      cutout: '60%',
      animation: {
        animateScale: true,
        animateRotate: true
      }
    },
  });
})();

if (document.getElementById("pie-chart") && typeof ApexCharts !== 'undefined') {
  const chart = new ApexCharts(document.getElementById("pie-chart"), getChartOptions());
  chart.render();
}

console.log(data);