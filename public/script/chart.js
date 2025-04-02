// const primaryColor = "oklch(0.546 0.245 262.881)";
const primaryColor = "oklch(0.723 0.219 149.579)";

const labelColor = "#e2e8f0";

const fontFamily = "Poppins";
let defaultOptions = {
  chart: {
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    width: "75%",
    height: 305,
    offsetY: 18,
    background: "transparent",
    animations: {
      enabled: true,
      easing: "easeinout",
      speed: 800,
      animateGradually: {
        enabled: true,
        delay: 150,
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350,
      },
    },
  },

  dataLabels: {
    enabled: false,
  },
};

let barOptions = {
  ...defaultOptions,

  chart: {
    ...defaultOptions.chart,
    type: "area",
  },

  tooltip: {
    enabled: true,
    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
      const value = series[seriesIndex][dataPointIndex];

      return `
        <div style="
          position: relative;
          background-color: #0F0B21;
          border-radius: 8px;
          padding: 12px 16px;
          min-width: 90px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.25);
          font-family: ${fontFamily};
          text-align: center;
        ">
          <div style="
            color: #6B7280;
            font-size: 13px;
            font-weight: 500;
            margin-bottom: 4px;
          ">Expense</div>
          <div style="
            color: white;
            font-size: 16px;
            font-weight: 600;
          ">${value.toLocaleString()}k</div>
          <div style="
            position: absolute;
            bottom: -8px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 8px solid #0F0B21;
          "></div>
        </div>
      `;
    },
    marker: {
      show: false,
    },
    x: {
      show: false,
    },
    y: {
      formatter: undefined,
    },
    onDatasetHover: {
      highlightDataSeries: true,
    },
  },

  series: [
    {
      name: "Expenses",
      data: [15, 50, 18, 90, 30, 10],
    },
  ],

  colors: [primaryColor],

  fill: {
    type: "gradient",
    gradient: {
      type: "vertical",
      opacityFrom: 1,
      opacityTo: 0,
      stops: [0, 100],
      colorStops: [
        {
          offset: 0,
          opacity: 0.2,
          color: primaryColor,
        },
        {
          offset: 100,
          opacity: 0,
          color: "transparent", // Changed to transparent to remove white background
        },
      ],
    },
  },

  stroke: {
    colors: [primaryColor],
    lineCap: "round",
    width: 3,
    curve: "smooth",
  },

  // Enhanced states for hover effects
  states: {
    normal: {
      filter: {
        type: "none",
      },
    },
    hover: {
      filter: {
        type: "lighten",
        value: 0.15,
      },
    },
    active: {
      allowMultipleDataPointsSelection: false,
      filter: {
        type: "darken",
        value: 0.35,
      },
    },
  },

  grid: {
    borderColor: "rgba(0, 0, 0, 0)",
  },

  markers: {
    size: 0,
    strokeColors: primaryColor,
    strokeWidth: 2,
    fillOpacity: 1,
    discrete: [],
    shape: "circle",
    radius: 2,
    hover: {
      size: 5,
      sizeOffset: 3,
    },
  },

  yaxis: {
    labels: {
      formatter: function (value) {
        const labelValues = [0, 20, 40, 60, 80, 100];
        return labelValues.includes(value) ? `${value}k` : "";
      },
      style: {
        colors: labelColor,
        fontFamily: fontFamily,
      },
    },
    tickAmount: 7,
  },

  xaxis: {
    tooltip: {
      enabled: false,
    },
    labels: {
      show: true,
      floating: true,
      style: {
        colors: labelColor,
        fontFamily: fontFamily,
      },
    },
    axisBorder: {
      show: false,
    },
    crosshairs: {
      show: false,
    },
    categories: ["Jan", "Mar", "May", "July", "Sept", "Nov"],
  },
};

// Alternative approach for hover effects using JS
const initChartEvents = () => {
  setTimeout(() => {
    const seriesElements = document.querySelectorAll(".apexcharts-series path");
    if (seriesElements.length) {
      seriesElements.forEach((path) => {
        path.style.transition = "stroke-width 0.3s ease, filter 0.3s ease";
        path.addEventListener("mouseenter", () => {
          path.style.strokeWidth = "4px";
          path.style.filter = `drop-shadow(0 0 6px ${primaryColor})`;
        });
        path.addEventListener("mouseleave", () => {
          path.style.strokeWidth = "3px";
          path.style.filter = "none";
        });
      });
    }
  }, 1000); // Give chart time to render
};

let chart = new ApexCharts(document.getElementById("chart"), barOptions);
chart.render();

// Initialize both animation approaches
initChartEvents();

//PIE CHART

(async function () {
  const data = [
    { year: "Belanja", count: 10 },
    { year: "Kebutuhan Pokok", count: 20 },
    { year: "Transportasi", count: 15 },
    { year: "Transfer", count: 15 },
    { year: "Lainnya", count: 15 },
  ];

  new Chart(document.getElementById("pieChart"), {
    type: "doughnut", // Mengubah tipe menjadi donut
    data: {
      labels: data.map((row) => row.year),
      datasets: [
        {
          label: "Acquisitions by year",
          data: data.map((row) => row.count),
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: {
            boxWidth: 15,
            font: {
              size: 12,
              family: fontFamily,
              weight: "bold",
            },
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false, // Menyesuaikan ukuran tinggi chart
      cutoutPercentage: 50, // Membuat donut dengan lubang di tengah
    },
  });
})();
