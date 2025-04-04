
// const primaryColor = "oklch(0.546 0.245 262.881)";
const primaryColor = "oklch(0.723 0.219 149.579)";

const labelColor = "#e2e8f0";

const fontFamily = "Poppins";

const options = {
  chart: {
    height: "100%",
    maxWidth: "100%",
    type: "area",
    fontFamily: "Inter, sans-serif",
    dropShadow: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
  },
  tooltip: {
    enabled: true,
    theme: "dark",
    style: {
      fontSize: "12px",
      fontFamily: "Inter, sans-serif",
    },
    x: {
      show: false,
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      opacityFrom: 0.55,
      opacityTo: 0,
      shade: "#1C64F2",
      gradientToColors: ["#1C64F2"],
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: 3, 
    curve: "smooth",
    colors: ["#31CE33"], 
  },
  grid: {
    show: false,
    strokeDashArray: 4,
    padding: {
      left: 10, // Tambahkan padding agar label tidak terpotong
      right: 10,
      top: 0,
      bottom: 10,
    },
  },
  series: [
    {
      name: "Your Expense",
      data: [12, 67, 34, 69, 13, 44, 70, 89, 99, 32, 10, 40],
      color: "#31CE33",
    },
  ],
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      labels: {
        show: true,
        rotate: -45,
        style: {
          fontFamily: "Inter, sans-serif",
          cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
        }
      },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: true,
    min: 0,
    max: 100,
    tickAmount: 5,
    labels: {
      style: {
        fontFamily: "Inter, sans-serif",
        cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
      }
    },
  },
}

if (document.getElementById("area-chart") && typeof ApexCharts !== 'undefined') {
  const chart = new ApexCharts(document.getElementById("area-chart"), options);
  chart.render();
}



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


