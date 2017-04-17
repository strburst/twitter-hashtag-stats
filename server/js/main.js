/* global $ */

require('../sass/main.scss');

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
