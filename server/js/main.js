/* global $ */

require('../sass/main.scss');
const Chart = require('chart.js');
const langs = require('langs');

function checkCountry(result) {
  return this === result[0];
}

let h;
function eachCountry(code) {
  if (h === undefined) {
    h = JSON.parse($('#hashtagstats-data').text());
  }

  let filtered = h.filter(checkCountry, code);
  if (filtered.length > 3) {
    filtered = filtered.slice(0, 3);
  }
  let returned = '\n';

  for (let i = 0; i < filtered.length; i += 1) {
    returned = `${returned + filtered[i][1]}: ${filtered[i][2]}\n`;
  }
  return returned;
}

$(() => {
  $('#hashtagstats-map').vectorMap({
    map: 'world_mill',
    backgroundColor: '#50cc82',
    onRegionTipShow(e, el, code) {
      el.html(el.html() + eachCountry(code));
    },
  });
});

function languageName(code) {
  if (code === 'und') {
    return 'Unknown';
  }
  if (code === 'in') { // 'id' is standard for Indonesian
    return 'Indonesian';
  }
  const language = langs.where('1', code);
  return language ? language.name : code;
}

const baseColors = [
  'rgba(255, 99, 132, 0.2)',
  'rgba(54, 162, 235, 0.2)',
  'rgba(255, 206, 86, 0.2)',
  'rgba(75, 192, 192, 0.2)',
  'rgba(153, 102, 255, 0.2)',
  'rgba(255, 159, 64, 0.2)',
];
function getColors(n) {
  const colors = [];
  for (let i = 0; i < n; i += 1) {
    colors.push(baseColors[i % baseColors.length]);
  }
  return colors;
}

/**
 * Convert data from the server to the format Chart.js wants.
 */
function languageDataTranform() {
  const rawData = JSON.parse($('#languagestats-data').text());

  const labels = [];
  const data = [];
  rawData.forEach(([lang, num]) => {
    labels.push(languageName(lang));
    data.push(num);
  });

  return {
    labels,
    datasets: [{
      label: '% tweets',
      backgroundColor: getColors(data.length),
      data,
    }],
  };
}

const languageChart = new Chart($('#languagestats-chart'), {
  type: 'bar',
  data: languageDataTranform(),
  options: {},
});
