const directoryEl = document.getElementById('directory');
const searchInput = document.getElementById('searchInput');
const postcodeFilter = document.getElementById('postcodeFilter');
const sortFilter = document.getElementById('sortFilter');
const quickFinder = document.getElementById('quickFinder');
const findBtn = document.getElementById('findBtn');
const resetBtn = document.getElementById('resetBtn');
const resultMeta = document.getElementById('resultMeta');
const lastUpdated = document.getElementById('lastUpdated');

const dataset = [
  { name: 'JTI Central Masjid Westgate', address: '9 Darfield St', city: 'Bradford', postcode: 'BD1 3RU', jummah: ['13:30', '14:30', '16:00'] },
  { name: 'Faizan e Attar', address: '10-72 Harris Street', city: 'Bradford', postcode: 'BD1 5JD', jummah: ['13:30'] },
  { name: 'Sayyidah Aminah', address: '117 Fagley Road', city: 'Bradford', postcode: 'BD2 3LR', jummah: ['13:30'] },
  { name: 'Jamia Masjid Al Faiz Tauji', address: '451-453 Otley Rd', city: 'Bradford', postcode: 'BD2 4QF', jummah: ['13:30', '14:30', '15:30'] },
  { name: 'Noor Ul Islam (Fagley)', address: '24 Gain Lane', city: 'Bradford', postcode: 'BD3 7LS', jummah: ['13:30'] },
  { name: 'Jamia Masjid (Off Killingall)', address: '101 Thornbury Rd', city: 'Bradford', postcode: 'BD3 8SA', jummah: ['13:30', '15:30'] },
  { name: 'JTI Barkerend Road', address: '85 Barkerend Road', city: 'Bradford', postcode: 'BD3 9AP', jummah: ['13:30', '14:00'] },
  { name: 'JTI Browning Street', address: '2 Browning Street', city: 'Bradford', postcode: 'BD3 9DX', jummah: ['13:30'] },
  { name: 'Jamia Chauqih Mehraj', address: '389 Leeds Road', city: 'Bradford', postcode: 'BD3 9LY', jummah: ['14:00'] },
  { name: 'Jamia Muhammadia', address: '92-96 Limiage St', city: 'Bradford', postcode: 'BD3 8EH', jummah: ['14:00'] },
  { name: 'Faizan e Madina', address: 'Moseley Street', city: 'Bradford', postcode: 'BD3 9LE', jummah: ['14:00'] },
  { name: 'Muhammadijah Qadriyya', address: '179 Otley Road', city: 'Bradford', postcode: 'BD3 9HX', jummah: ['13:30', '14:30', '16:30'] },
  { name: 'Ghosia Chauia', address: '39 Undercliffe Ln', city: 'Bradford', postcode: 'BD3 9DW', jummah: ['14:00'] },
  { name: 'JTI Cowpeny Street', address: '43 Cowpeny Street', city: 'Bradford', postcode: 'BD4 7HG', jummah: ['14:00'] },
  { name: 'Al Jamia Sulfa Tal Islam', address: 'Holton Park Ave', city: 'Bradford', postcode: 'BD5 0LD', jummah: ['13:30'] },
  { name: 'JTI Ryan Street', address: '87-89 Ryan St', city: 'Bradford', postcode: 'BD5 7AP', jummah: ['14:00'] },
  { name: 'JTI Burnet Place', address: '1-3 Burnet Place', city: 'Bradford', postcode: 'BD5 8LD', jummah: ['13:30'] },
  { name: 'Jamiya Tethmania Rizvia', address: '1 Ryan Street', city: 'Bradford', postcode: 'BD5 7QD', jummah: ['13:30'] },
  { name: 'Jama Islama Billah', address: '119 Scofield St', city: 'Bradford', postcode: 'BD5 9HQ', jummah: ['14:30'] },
  { name: 'Faizan e Raza (Wibsey)', address: '71 Beacon Road', city: 'Bradford', postcode: 'BD6 3ET', jummah: ['13:30'] },
  { name: 'Madrasi Al-Zahra (MUQ)', address: 'Baille Lane', city: 'Bradford', postcode: 'BD7 4QF', jummah: ['14:00'] },
  { name: 'Maqfor e Islam Ghoussia', address: '6-7 Low Green', city: 'Bradford', postcode: 'BD7 3JT', jummah: ['14:00', '13:00'] },
  { name: 'Al Markazi Ul Islami (SMT)', address: 'Beasdale Lane', city: 'Bradford', postcode: 'BD7 2JX', jummah: ['13:30'] },
  { name: 'Jamia Misal-e-Islama', address: '15 Ivantine Road', city: 'Bradford', postcode: 'BD7 3JY', jummah: ['13:30'] },
  { name: 'JTI Shearbridge Road', address: '28 Shearbridge Rd', city: 'Bradford', postcode: 'BD7 1NA', jummah: ['13:30', '14:15'] },
  { name: 'JTI Hilton Road', address: '38 Hilton Road', city: 'Bradford', postcode: 'BD7 2ED', jummah: ['14:00', '15:30'] },
  { name: 'JTI Northside Terrace', address: '1 Northside Terr', city: 'Bradford', postcode: 'BD7 2PB', jummah: ['14:00'] },
  { name: 'Jamia Masjid Hazrat', address: '2 Ambler Street', city: 'Bradford', postcode: 'BD8 8AW', jummah: ['13:30'] },
  { name: 'Al Hikam Institute', address: '12 Bull Royal Lane', city: 'Bradford', postcode: 'BD8 0LJ', jummah: ['14:15'] },
  { name: 'Shahjalal Lalitish Masjid', address: '61/63 Lumb Lane', city: 'Bradford', postcode: 'BD8 0BQ', jummah: ['13:30'] },
  { name: 'Jamia Alansiairy Nazia', address: '350 Collingron Rd', city: 'Bradford', postcode: 'BD8 9PA', jummah: ['14:00'] },
  { name: 'JTI Toller Lane', address: '133 Toller Lane', city: 'Bradford', postcode: 'BD8 9RL', jummah: ['13:30', '14:30'] },
  { name: 'JTI Southfield Square', address: '68-69 Southfield Sq', city: 'Bradford', postcode: 'BD8 7SN', jummah: ['14:00'] },
  { name: 'JTI Houxton Street', address: '28 Houxton Street', city: 'Bradford', postcode: 'BD8 9HG', jummah: ['14:00'] },
  { name: 'Jamia Naqshbandia Asiama', address: '63 Tile Street', city: 'Bradford', postcode: 'BD8 8NX', jummah: ['13:30', '14:30'] },
  { name: 'Al Mustafa Centre', address: 'Young Street', city: 'Bradford', postcode: 'BD8 9FE', jummah: ['13:30', '14:30'] },
  { name: 'Faizan e Makkah', address: 'Lilycroft Road', city: 'Bradford', postcode: 'BD9 5AB', jummah: ['13:30', '14:30', '16:15'] },
  { name: 'JTI Victor Street', address: 'Victor Street', city: 'Bradford', postcode: 'BD9 4RA', jummah: ['13:40'] },
  { name: 'JTI Jesmond Avenue', address: '11 Jesmond Ave', city: 'Bradford', postcode: 'BD9 5CP', jummah: ['13:30'] },
  { name: 'JTI Haworth Road Masjid', address: '134 Haworth Road', city: 'Bradford', postcode: 'BD9 8LL', jummah: ['13:30', '15:00', '15:45'] },
  { name: 'JTI Frazenghast', address: '52-54 Airedale Rd', city: 'Bradford', postcode: 'BD8 4RN', jummah: ['14:00', '15:00'] },
  { name: 'Jamia Ummania', address: '394 Heaton Road', city: 'Bradford', postcode: 'BD9 4RR', jummah: ['13:30', '14:15', '16:00'] },
  { name: 'Markazi Jam-The Lux Mosque', address: 'Ernest Road', city: 'Bradford', postcode: 'BD9 6-H', jummah: ['13:30'] },
  { name: 'Mustafa Munir', address: 'Emm Lane', city: 'Bradford', postcode: 'BD9 2JL', jummah: ['13:30'] },
  { name: 'JTI Allenon', address: '91 Safford Drive', city: 'Keighley', postcode: 'BD15 7NQ', jummah: ['13:30', '14:15'] },
  { name: 'Jamia Shan-e-Islam', address: '80 Bramdaley Road', city: 'Ilkley', postcode: 'BD18 2QR', jummah: ['13:30'] },
  { name: 'Ilya College (Shepley)', address: '82 Oley Road', city: 'Ilkley', postcode: 'BD18 3SA', jummah: ['13:30', '15:00'] },
  { name: 'Markaiz Jamal Masqid', address: '75 Emily Street', city: 'Haworth', postcode: 'BD21 3EG', jummah: ['13:45'] },
  { name: 'Shahjalal Jamia Masqid', address: '3 Temple Row', city: 'Haworth', postcode: 'BD21 3SL', jummah: ['13:45'] },
  { name: 'Abu Zahra Foundation', address: 'Demonsplace Street', city: 'Haworth', postcode: 'BD21 2SL', jummah: ['14:00'] },
  { name: 'Ghosiyah Masjid', address: '206 Skipton Road', city: 'Haworth', postcode: 'BD21 2TA', jummah: ['14:00'] },
  { name: 'Jamia Masjid Ghouasia', address: '7 Brooklyn Terr, Armley', city: 'Leeds', postcode: 'LS12 2NX', jummah: ['14:00'] },
  { name: 'Jamia Masjid Blad', address: 'Comsey Rd, Harmilt', city: 'Leeds', postcode: 'LS8 3JR', jummah: ['14:00'] },
  { name: 'Jamia Abu Huraira', address: 'Catharine Gr, Breeton', city: 'Leeds', postcode: 'LS11 6LU', jummah: ['14:00'] },
  { name: 'Al Markazi Mosque', address: '36 Thornville Rd', city: 'Leeds', postcode: 'LS6 1JY', jummah: ['14:00'] },
  { name: 'Faizan of Madina', address: '49 Barkly Road', city: 'Halifax', postcode: 'LS11 7EN', jummah: ['13:45'] },
  { name: 'Jamia Mosque Madih', address: '117-131 Gibbet St', city: 'Halifax', postcode: 'HX1 5BP', jummah: ['14:00'] },
  { name: 'Jamia Masjid Ghouasia', address: '49 Rhodes Street', city: 'Halifax', postcode: 'HX1 5DE', jummah: ['14:00', '16:00'] },
  { name: 'Faizan of Madina', address: '275 Gibbet Street', city: 'Halifax', postcode: 'HX1 4JC', jummah: ['13:30', '14:30'] },
  { name: 'Jamia Masjid Norani', address: '29 Gibraltar Road', city: 'Halifax', postcode: 'HX1 4PD', jummah: ['13:30', '14:30'] },
  { name: 'Faizan of Madina', address: '75 New North Road', city: 'Huddersfield', postcode: 'HD1 5ND', jummah: ['13:30'] },
  { name: 'Anwar e Madina', address: '8-10 Clara Street', city: 'Huddersfield', postcode: 'HD1 6EN', jummah: ['14:00'] },
  { name: 'Jamia Masjid Abu Bakr', address: '664 Church Street', city: 'Huddersfield', postcode: 'HD1 4UD', jummah: ['14:00', '16:30'] },
  { name: 'Hanifa Masjid', address: '61 Bentley Street', city: 'Hebden Bridge', postcode: 'HD1 3UL', jummah: ['14:00', '16:30'] },
  { name: 'Jamia Masjid Ghouasia', address: '73 Victoria Road', city: 'Hebden Bridge', postcode: 'HX1 2PT', jummah: ['14:00', '16:00'] },
  { name: 'Masjid Riza', address: '129 Halifax Old Rd', city: 'Hebden Bridge', postcode: 'HD2 2RP', jummah: ['14:15'] },
  { name: 'Jamia Kanzul Imaan', address: 'Albion Street', city: 'Wakefield', postcode: 'WF18 8LQ', jummah: ['13:30', '16:00'] },
  { name: 'Jamia Al-Ikhawan', address: 'Ings Road', city: 'Wakefield', postcode: 'WF18 9HG', jummah: ['13:30', '16:00'] },
  { name: 'M. Ghassia Masqid', address: '1 Whittier Street', city: 'Wakefield', postcode: 'WF17 5AG', jummah: ['13:30', '16:00'] },
  { name: 'M. Ghassia Masaresa', address: '111 Dark Lane', city: 'Wakefield', postcode: 'WF17 7PW', jummah: ['13:30', '16:00'] },
  { name: 'Jamia Al Saeed', address: '160 Bromeley Street', city: 'Wakefield', postcode: 'WF17 6LU', jummah: ['13:30'] },
  { name: 'Jamia Abu Sadique', address: 'Ernest Street', city: 'Wakefield', postcode: 'WF13 1JPS', jummah: ['13:30'] },
  { name: 'Gulzar e Madina', address: '3 High St, Westtown', city: 'Wakefield', postcode: 'WF13 2PU', jummah: ['14:00'] },
  { name: 'Muhammad & Azam', address: '256-Rawmoluslud Rd', city: 'Wakefield', postcode: 'WF13 3QU', jummah: ['13:30'] },
  { name: 'Faizan e Madina', address: '13 Pilgrim Ave', city: 'Wakefield', postcode: 'WF3 3HQ', jummah: ['13:30'] },
  { name: 'Jamia Masjid Swarta', address: 'Park Hill Lane', city: 'Wakefield', postcode: 'WF1 4NJ', jummah: ['13:30', '14:30', '15:45'] },
  { name: 'Madina Masjid Institute', address: '38 Duke of York St', city: 'Wakefield', postcode: 'WF1 3PD', jummah: ['14:15'] },
  { name: 'Madina Masjid', address: '82-84 St Catherine St', city: 'Wakefield', postcode: 'WF1 5BP', jummah: ['13:30', '14:45'] },
  { name: 'Markazi Jamia Mosque', address: '12 Grunge Street', city: 'Wakefield', postcode: 'WF2 8TF', jummah: ['13:45', '14:45'] },
  { name: 'Ghassia Masjid', address: '21-27 Warren Street', city: 'Wakefield', postcode: 'WF12 8LU', jummah: ['14:00', '16:00'] },
  { name: 'Ghassia Masjid', address: '27 North Road', city: 'Wakefield', postcode: 'WF13 3AB', jummah: ['14:15'] },
  { name: 'Naqshbandiaya Al-jamiyya', address: '130 North Road', city: 'Wakefield', postcode: 'WF13 3AQ', jummah: ['13:30'] },
  { name: 'Faizan of Madina', address: '5 John Street', city: 'Wakefield', postcode: 'WF13 3LE', jummah: ['13:30'] },
  { name: 'Raza Educatian & CC', address: '399 Lees Hall Rd', city: 'Wakefield', postcode: 'WF12 9HB', jummah: ['13:30'] },
  { name: 'Qissarah Iraqi Masqid', address: '174 Saville Road', city: 'Wakefield', postcode: 'WF12 9PA', jummah: ['13:30', '16:00'] },
  { name: 'Markazi Masqid', address: '31-33 Kentland St', city: 'Wakefield', postcode: 'WF12 9PU', jummah: ['13:30'] },
  { name: 'Ghassia Masqid', address: '21-27 Warren Street', city: 'Wakefield', postcode: 'WF12 9LU', jummah: ['14:00', '16:00'] },
  { name: 'Ghassia Masqid & Sharia STI', address: 'Chanshaw Street', city: 'Wakefield', postcode: 'WF13 3ER', jummah: ['14:00', '16:00'] }
];
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

  // Create precise Google Maps URL
  const fullAddress = `${mosque.name}, ${mosque.address}, ${mosque.city}, ${mosque.postcode}, UK`;
  const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(fullAddress)}`;

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
        <button type="button" class="btn-directions" onclick="window.open('${mapsUrl}', '_blank', 'noopener,noreferrer')">📍 Get Directions</button>
        ${mosque.website ? `<a href="${mosque.website}" target="_blank" rel="noopener noreferrer">🌐 Website</a>` : ''}
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
  populatePostcodeFilter();
  setupEvents();
  render();
  lastUpdated.textContent = 'Source: Jummah.jpeg';
}

init().catch(() => {
  directoryEl.innerHTML = '<p>Unable to load mosque directory data.</p>';
});
