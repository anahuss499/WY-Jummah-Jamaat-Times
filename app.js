const directoryEl = document.getElementById('directory');
const searchInput = document.getElementById('searchInput');
const postcodeFilter = document.getElementById('postcodeFilter');
const sortFilter = document.getElementById('sortFilter');
const quickFinder = document.getElementById('quickFinder');
const findBtn = document.getElementById('findBtn');
const resetBtn = document.getElementById('resetBtn');
const resultMeta = document.getElementById('resultMeta');
const lastUpdated = document.getElementById('lastUpdated');

let dataset = [];
const JUMMAH_TIME_NOT_SET = '99:99';

const areaFromPostcode = (postcode) => (postcode || '').trim().split(' ')[0].toUpperCase();
const firstJummahTime = (jummah) => (Array.isArray(jummah) && jummah.length ? jummah[0] : JUMMAH_TIME_NOT_SET);

const nextJummahForTime = (time) => {
  const now = new Date();
  const [h, m] = time.split(':').map(Number);
  const target = new Date(now);
  const day = target.getDay();
  const daysUntilFriday = (5 - day + 7) % 7;
  target.setDate(target.getDate() + daysUntilFriday);
  target.setHours(h, m, 0, 0);
  if (daysUntilFriday === 0 && target < now) target.setDate(target.getDate() + 7);
  return target;
};

function mosqueCard(mosque) {
  const card = document.createElement('article');
  card.className = 'mosque-card';

  const nextTimes = (mosque.jummah || []).map((t) => ({ t, at: nextJummahForTime(t).getTime() }));
  const nearest = nextTimes.length ? Math.min(...nextTimes.map((x) => x.at)) : null;

  const fridayTimes = nextTimes.map(({ t, at }) => {
    const upcoming = nearest !== null && at === nearest;
    return `<span class="badge badge-friday ${upcoming ? 'badge-upcoming' : ''}">🕌 Jummah ${t}${upcoming ? ' · Upcoming' : ''}</span>`;
  }).join('');

  const prayers = [
    ['Fajr', mosque.fajr],
    ['Dhuhr', mosque.dhuhr],
    ['Asr', mosque.asr],
    ['Maghrib', mosque.maghrib],
    ['Isha', mosque.isha]
  ].filter(([, v]) => v);

  card.innerHTML = `
    <header class="mosque-head">
      <h3>${mosque.name}</h3>
    </header>
    <div class="mosque-body">
      <p class="address"><strong>Address:</strong> ${mosque.address}, ${mosque.city}, <strong>${mosque.postcode}</strong></p>
      <div class="prayer-list" aria-label="Daily prayer times">
        ${prayers.map(([n, t]) => `<span class="badge">${n} ${t}</span>`).join('')}
      </div>
      <div class="jummah-list" aria-label="Friday prayer times">${fridayTimes || '<span class="badge badge-friday">Jummah time not listed</span>'}</div>
      <p class="small"><strong>Contact:</strong> ${mosque.contact || 'Not listed'}</p>
      <p class="small"><strong>Notes:</strong> ${mosque.notes || 'No additional notes'}</p>
      <div class="links">
        ${mosque.website ? `<a href="${mosque.website}" target="_blank" rel="noopener noreferrer">Website</a>` : ''}
      </div>
    </div>
  `;

  return card;
}

function render() {
  const search = searchInput.value.trim().toLowerCase();
  const filterArea = postcodeFilter.value;
  const quickArea = quickFinder.value.trim().toUpperCase();
  const sortBy = sortFilter.value;

  let list = dataset.filter((m) => m.name.toLowerCase().includes(search));

  if (filterArea) {
    list = list.filter((m) => areaFromPostcode(m.postcode) === filterArea);
  }

  if (quickArea) {
    list = list.filter((m) => areaFromPostcode(m.postcode).startsWith(quickArea));
  }

  list.sort((a, b) => {
    if (sortBy === 'postcode') return a.postcode.localeCompare(b.postcode);
    if (sortBy === 'time') return firstJummahTime(a.jummah).localeCompare(firstJummahTime(b.jummah));
    return a.name.localeCompare(b.name);
  });

  const grouped = list.reduce((acc, m) => {
    const area = areaFromPostcode(m.postcode);
    if (!acc[area]) acc[area] = [];
    acc[area].push(m);
    return acc;
  }, {});

  const areas = Object.keys(grouped).sort();
  directoryEl.innerHTML = '';

  if (!areas.length) {
    directoryEl.innerHTML = '<p>No mosques match your current filters.</p>';
  }

  areas.forEach((area) => {
    const details = document.createElement('details');
    details.className = 'postcode-group';
    details.open = true;
    details.innerHTML = `<summary>${area} (${grouped[area].length} mosque${grouped[area].length === 1 ? '' : 's'})</summary>`;

    const grid = document.createElement('div');
    grid.className = 'mosque-grid';
    grouped[area].forEach((mosque) => grid.appendChild(mosqueCard(mosque)));

    details.appendChild(grid);
    directoryEl.appendChild(details);
  });

  resultMeta.textContent = `${list.length} mosque${list.length === 1 ? '' : 's'} shown across ${areas.length} postcode area${areas.length === 1 ? '' : 's'}.`;
}

function populatePostcodeFilter() {
  const areas = [...new Set(dataset.map((m) => areaFromPostcode(m.postcode)))].sort();
  areas.forEach((area) => {
    const opt = document.createElement('option');
    opt.value = area;
    opt.textContent = area;
    postcodeFilter.appendChild(opt);
  });
}

function setupEvents() {
  [searchInput, postcodeFilter, sortFilter].forEach((el) => el.addEventListener('input', render));
  quickFinder.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') render();
  });
  findBtn.addEventListener('click', render);
  resetBtn.addEventListener('click', () => {
    searchInput.value = '';
    postcodeFilter.value = '';
    sortFilter.value = 'name';
    quickFinder.value = '';
    render();
  });
}

async function init() {
  const res = await fetch('mosques.json');
  const data = await res.json();
  dataset = data.mosques || [];
  populatePostcodeFilter();
  setupEvents();
  render();
  const ts = data.lastUpdated ? new Date(data.lastUpdated) : new Date();
  lastUpdated.textContent = `Last updated: ${ts.toLocaleString('en-GB', { hour12: false })}`;
}

init().catch(() => {
  directoryEl.innerHTML = '<p>Unable to load mosque directory data.</p>';
});
