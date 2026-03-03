// change this to reference the dataset you chose to work with.
import { gameSales as chartData } from "./data/gameSales.js";

// --- DOM helpers ---
const yearSelect = document.getElementById("yearSelect");
const titleSelect = document.getElementById("titleSelect");
const metricSelect = document.getElementById("metricSelect");
const chartTypeSelect = document.getElementById("chartType");
const renderBtn = document.getElementById("renderBtn");
const dataPreview = document.getElementById("dataPreview");
const canvas = document.getElementById("chartCanvas");

let currentChart = null;

// --- Populate dropdowns from data ---
const years = [...new Set(chartData.map(r => r.year))];
const titles = [...new Set(chartData.map(r => r.title))];

years.forEach(m => yearSelect.add(new Option(m, m)));
titles.forEach(h => titleSelect.add(new Option(h, h)));

yearSelect.value = years[0];
titleSelect.value = titles[0];

// Preview first 6 rows
dataPreview.textContent = JSON.stringify(chartData.slice(0, 6), null, 2);

// --- Main render ---
renderBtn.addEventListener("click", () => {
  const chartType = chartTypeSelect.value;
  const year = yearSelect.value;
  const title = titleSelect.value;
  const metric = metricSelect.value;

  // Destroy old chart if it exists (common Chart.js gotcha)
  if (currentChart) currentChart.destroy();

  // Build chart config based on type
  const config = buildConfig(chartType, { year, title, metric });

  currentChart = new Chart(canvas, config);
});

// --- Students: you’ll edit / extend these functions ---
function buildConfig(type, { year, title, metric }) {
  if (type === "bar") return barBytitle(year, metric);
  if (type === "line") return lineOverTime(title, ["Genres", "revenueUSD"]);
  if (type === "scatter") return scatterGenresVsTemp(title);
  if (type === "doughnut") return doughnutYearVsTitle(year, title);
  if (type === "radar") return radarComparetitles(year);
  return barBytitle(year, metric);
}

// Task A: BAR — compare titles for a given year
function barBytitle(year, metric) {
  const rows = chartData.filter(r => r.year === year);

  const labels = rows.map(r => r.title);
  const values = rows.map(r => r[metric]);

  return {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: `${metric} in ${year}`,
        data: values
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: `title comparison (${year})` }
      },
      scales: {
        y: { title: { display: true, text: metric } },
        x: { title: { display: true, text: "title" } }
      }
    }
  };
}

// Task B: LINE — trend over time for one title (2 datasets)
function lineOverTime(title, metrics) {
  const rows = chartData.filter(r => r.title === title);

  const labels = rows.map(r => r.year);

  const datasets = metrics.map(m => ({
    label: m,
    data: rows.map(r => r[m])
  }));

  return {
    type: "line",
    data: { labels, datasets },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: `Trends over time: ${title}` }
      },
      scales: {
        y: { title: { display: true, text: "Value" } },
        x: { title: { display: true, text: "year" } }
      }
    }
  };
}

// SCATTER — relationship between temperature and Genres
function scatterGenresVsTemp(title) {
  const rows = chartData.filter(r => r.title === title);

  const points = rows.map(r => ({ x: r.tempC, y: r.Genres }));

  return {
    type: "scatter",
    data: {
      datasets: [{
        label: `Genres vs Temp (${title})`,
        data: points
      }]
    },
    options: {
      plugins: {
        title: { display: true, text: `Does temperature affect Genres? (${title})` }
      },
      scales: {
        x: { title: { display: true, text: "Temperature (C)" } },
        y: { title: { display: true, text: "Genres" } }
      }
    }
  };
}

// DOUGHNUT — member vs casual share for one title + year
function doughnutYearVsTitle(year) {
  const row = chartData.find(r => r.year === year);
console.log(row[1]);
  let esport = 0;
  for (let i = 0; i <= row; i++) {
    if (row.esports == 1) {
      esport = esport + 1;
        
    } else {
      console.log("zero");
    }
  }

  esport = Math.round(esport * 100);
console.log(esport);
  const nonEsport = 100 - esport;

  return {
    type: "doughnut",
    data: {
      labels: ["Esports (%)", "No Esports (%)"],
      datasets: [{ label: "Game mix", data: [esport, nonEsport] }]
    },
    options: {
      plugins: {
        title: { display: true, text: `Game mix: (${year})` }
      }
    }
  };
}

// RADAR — compare titles across multiple metrics for one year
function radarComparetitles(year) {
  const rows = chartData.filter(r => r.year === year);

  const metrics = ["Genres", "revenueUSD", "avgDurationMin", "incidents"];
  const labels = metrics;

  const datasets = rows.map(r => ({
    label: r.title,
    data: metrics.map(m => r[m])
  }));

  return {
    type: "radar",
    data: { labels, datasets },
    options: {
      plugins: {
        title: { display: true, text: `Multi-metric comparison (${year})` }
      }
    }
  };
}