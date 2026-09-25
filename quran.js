const API_URL = "https://api.alquran.cloud/v1/quran/quran-indopak";
const content = document.getElementById("quranContent");
const search = document.getElementById("quranSearch");
const surahSelect = document.getElementById("surahSelect");
const status = document.getElementById("readerStatus");
let surahs = [];

const esc = (value) => String(value).replace(/[&<>\"]/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;"
}[character]));

/* ---- Static surah index ----
   Lets the dropdown show all 114 surahs immediately, without waiting on the
   network. Once the API data arrives we swap each label for the API's own
   name, so anything genuinely authoritative comes from the source data. */
const SURAH_INDEX = [
  "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس",
  "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه",
  "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم",
  "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر",
  "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق",
  "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة",
  "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج",
  "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس",
  "التكوير", "الإنفطار", "المطففين", "الإنشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد",
  "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات",
  "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر",
  "المسد", "الإخلاص", "الفلق", "الناس"
];

function populateSurahSelect(names) {
  surahSelect.querySelectorAll("option:not(:first-child)").forEach((option) => option.remove());
  names.forEach((name, index) => {
    const option = document.createElement("option");
    option.value = String(index + 1);
    option.textContent = `${index + 1}. ${name}`;
    surahSelect.append(option);
  });
}

/* ---- Accurate line packing ----
   Instead of guessing how many characters fit a line, we measure the real
   rendered width of the text (using the page's actual font + the actual
   width of a .quran-page once its CSS padding is applied) and pack words
   until the next one would overflow. This is what makes each line's true
   width land close to the container width, so the CSS justify-stretch only
   has to nudge spacing slightly instead of stretching wildly uneven lines. */
const measureCanvas = document.createElement("canvas");
const measureCtx = measureCanvas.getContext("2d");
if ("direction" in measureCtx) measureCtx.direction = "rtl";
let measureProbe = null;

function getLayoutMetrics() {
  if (!measureProbe) {
    const probe = document.createElement("div");
    probe.setAttribute("aria-hidden", "true");
    probe.style.cssText = "visibility:hidden;height:0;overflow:hidden;pointer-events:none;";
    probe.innerHTML = '<div class="ayahs"><div class="quran-page"><div class="quran-line"></div></div></div>';
    document.querySelector(".quran-shell").appendChild(probe);
    measureProbe = probe;
  }
  const page = measureProbe.querySelector(".quran-page");
  const line = measureProbe.querySelector(".quran-line");
  const style = getComputedStyle(line);
  return {
    width: page.clientWidth,
    font: `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
  };
}

const ARABIC_INDIC_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const toArabicIndicDigits = (n) => String(n).split("").map((d) => ARABIC_INDIC_DIGITS[d] ?? d).join("");

function makePages(ayahs, metrics) {
  measureCtx.font = metrics.font;
  const maxWidth = Math.max(metrics.width - 4, 40); // small safety margin against sub-pixel rounding
  const spaceWidth = measureCtx.measureText(" ").width;
  const tokens = ayahs.flatMap((ayah) =>
    `${ayah.text} ۝${toArabicIndicDigits(ayah.numberInSurah)}`.split(/\s+/).filter(Boolean)
  );

  const lines = [];
  let line = "";
  let lineWidth = 0;
  tokens.forEach((token) => {
    const tokenWidth = measureCtx.measureText(token).width;
    const withSpace = line ? spaceWidth + tokenWidth : tokenWidth;
    if (line && lineWidth + withSpace > maxWidth) {
      lines.push(line);
      line = token;
      lineWidth = tokenWidth;
    } else {
      line = line ? `${line} ${token}` : token;
      lineWidth += withSpace;
    }
  });
  if (line) lines.push(line);

  const pages = [];
  for (let index = 0; index < lines.length; index += 16) pages.push(lines.slice(index, index + 16));
  return pages;
}

function render() {
  const metrics = getLayoutMetrics();
  const query = search.value.trim().toLowerCase();
  const selected = surahSelect.value;
  let visible = 0;
  content.innerHTML = surahs.map((surah) => {
    const surahMatch = !selected || selected === String(surah.number);
    const matchingAyahs = surah.ayahs.filter((ayah) => {
      if (!query) return true;
      return surah.name.toLowerCase().includes(query) || String(surah.number) === query || ayah.text.includes(query);
    });
    if (!surahMatch || !matchingAyahs.length) return "";
    visible++;
    const pages = makePages(matchingAyahs, metrics).map((page) => {
      const lines = Array.from({ length: 16 }, (_, index) =>
        `<div class="quran-line">${page[index] ? esc(page[index]) : ""}</div>`
      ).join("");
      return `<div class="quran-page">${lines}</div>`;
    }).join("");
    return `<article class="surah" id="surah-${surah.number}">
      <header class="surah-heading"><span>${surah.number}</span><h2>${esc(surah.name)}</h2><span></span></header>
      <div class="ayahs">${pages}</div>
    </article>`;
  }).join("");
  status.textContent = query || selected ? `${visible} surah${visible === 1 ? "" : "s"} found` : `${surahs.length} surahs`;
}

async function loadQuran() {
  try {
    if (document.fonts && document.fonts.ready) await document.fonts.ready; // ensure Amiri is loaded before we measure widths
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Unable to load Quran");
    const result = await response.json();
    surahs = result.data.surahs;
    surahs.forEach((surah) => {
      const option = surahSelect.querySelector(`option[value="${surah.number}"]`);
      if (option) option.textContent = `${surah.number}. ${surah.name}`;
    });
    render();
  } catch (error) {
    status.textContent = "The Quran could not be loaded. Please check your connection and try again.";
    content.innerHTML = `<button class="retry" type="button" onclick="location.reload()">Try again</button>`;
  }
}

function debounce(fn, wait) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

search.addEventListener("input", debounce(() => { if (surahs.length) render(); }, 150));
surahSelect.addEventListener("change", () => { if (surahs.length) render(); });
window.addEventListener("resize", debounce(() => { if (surahs.length) render(); }, 200));

populateSurahSelect(SURAH_INDEX); // full list available straight away
loadQuran();
