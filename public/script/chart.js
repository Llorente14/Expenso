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
      data: [], // Data akan diisi secara dinamis
      color: "#31CE33",
    },
  ],
  xaxis: {
    type:"datetime", // Kategori akan diisi secara dinamis
    labels: {
      show: true,
     
      style: {
        fontFamily: "Inter, sans-serif",
        cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400",
      },
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
    tickAmount: 7,
    labels: {
      style: {
        fontFamily: "Inter, sans-serif",
        cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400",
      },
    },
  },
};

let chart; // Global chart instance

// Fungsi untuk mengambil data pengeluaran dari server dan memperbarui chart
async function fetchExpenseData(period = "daily") {
  try {
    const response = await fetch(`/api/expenses?period=${period}`);
    const data = await response.json();

    // Transformasi data untuk grafik
    const seriesData = data.map((expense) => [
      new Date(expense.date).getTime(), // Ubah tanggal menjadi timestamp
      expense.price || 0, // Nilai pengeluaran
    ]);

    console.log("Series Data:", seriesData);

    // Update chart options
    options.series[0].data = seriesData;

    // Render ulang chart
    renderChart();
  } catch (error) {
    console.error("Failed to fetch expense data:", error);
  }
}

function renderChart() {
  if (chart) {
    chart.destroy(); // Hapus grafik lama
  }
  chart = new ApexCharts(document.getElementById("area-chart"), options);
  chart.render().then(() => {
    initChartEvents(); // Inisialisasi efek hover setelah chart dirender
    console.log("Chart rendered with updated options:", options);
  });
}

// Event listener untuk kartu periode
document.addEventListener("DOMContentLoaded", () => {
  const periodCards = document.querySelectorAll(".period-card");

  periodCards.forEach((card) => {
    card.addEventListener("click", () => {
      const period = card.getAttribute("data-period"); // Ambil nilai periode
      console.log("Period clicked:", period);

      // Panggil fetchExpenseData untuk memperbarui chart
      fetchExpenseData(period);
    });
  });

  // Render chart pertama kali dengan periode default
  fetchExpenseData("monthly");
});

// Fungsi untuk menambahkan efek hover pada chart
function initChartEvents() {
  setTimeout(() => {
    const seriesElements = document.querySelectorAll(".apexcharts-series path");
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
  }, 1000); // Beri waktu untuk chart selesai dirender
}