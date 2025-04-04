document.addEventListener("DOMContentLoaded", function () {
  // Data
  const data = [
    { category: "Belanja", count: 30 },
    { category: "Kebutuhan Pokok", count: 25 },
    { category: "Transportasi", count: 20 },
    { category: "Transfer", count: 15 },
    { category: "Lainnya", count: 10 },
  ];

  // Warna baru yang lebih vibrant dengan kombinasi slate dan indigo
  const colors = [
    "#818cf8", // indigo-400
    "#6366f1", // indigo-500
    "#4f46e5", // indigo-600
    "#94a3b8", // slate-400
    "#64748b", // slate-500
    "#475569", // slate-600
  ];

  const options = {
    series: data.map((item) => item.count),
    chart: {
      type: "donut",
      height: "100%",
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 900,
      },
    },
    labels: data.map((item) => item.category),
    colors: colors,
    plotOptions: {
      pie: {
        donut: {
          size: "60%", // Mengatur ukuran lubang tengah
          labels: {
            show: true,
            color: "f1f5f9",
            //Tulisan tengah total
            total: {
              show: true,
              label: "Total",
              color: "#e2e8f0", // slate-200
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0) + "%";
              },
            },
          },
        },
      },
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",

      labels: {
        colors: "#e2e8f0", // slate-200 untuk kontras
        useSeriesColors: false,
      },
      itemMargin: {
        horizontal: 12,
        vertical: 7,
      },
    },
    dataLabels: {
      enabled: false,
      style: {
        colors: ["#f8fafc"], // slate-50
        fontSize: "12px",
        fontFamily: "'Poppins', sans-serif",
      },
      dropShadow: {
        enabled: false,
      },
      formatter: function (val, { seriesIndex, w }) {
        return w.config.labels[seriesIndex] + ": " + val + "%";
      },
    },
    tooltip: {
      enabled: true,
      style: {
        fontSize: "14px",
        fontFamily: "'Poppins', sans-serif",
        colors: ["#e2e8f0", "f1f5f9"],
      },
      y: {
        formatter: function (value) {
          return value + "%";
        },
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const chart = new ApexCharts(document.getElementById("pieChart"), options);
  chart.render();
});
