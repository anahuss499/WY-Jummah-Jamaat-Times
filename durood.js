const duroods = {
  ibrahim: {
    name: "Durood Ibrahim",
    arabic: "اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ۔ اللَّهُمَّ بَارِكْ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ۔"
  },
  short: {
    name: "Short Durood",
    arabic: "صَلَّى اللّٰهُ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ وَبَارَكَ وَسَلَّمَ"
  },
  tunajjina: {
    name: "Durood Tunajjina",
    arabic: "اللَّهُمَّ صَلِّ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ صَلَاةً تُنَجِّينَا بِهَا مِنْ جَمِيعِ الْأَهْوَالِ وَالْآفَاتِ، وَتَقْضِي لَنَا بِهَا جَمِيعَ الْحَاجَاتِ، وَتُطَهِّرُنَا بِهَا مِنْ جَمِيعِ السَّيِّئَاتِ، وَتَرْفَعُنَا بِهَا عِنْدَكَ أَعْلَى الدَّرَجَاتِ، وَتُبَلِّغُنَا بِهَا أَقْصَى الْغَايَاتِ مِنْ جَمِيعِ الْخَيْرَاتِ فِي الْحَيَاةِ وَبَعْدَ الْمَمَاتِ، إِنَّكَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ"
  },
  custom: {
    name: "My own recitation",
    arabic: ""
  }
};
const countOutput = document.getElementById("count");
const select = document.getElementById("duroodSelect");
const targetSelect = document.getElementById("targetSelect");
const customTarget = document.getElementById("customTarget");
const customDuroodWrap = document.getElementById("customDuroodWrap");
const customDurood = document.getElementById("customDurood");
const counter = document.getElementById("counter");
const progress = document.getElementById("progress");
const targetStatus = document.getElementById("targetStatus");
const countsKey = "west-yorkshire-durood-counts";
const settingsKey = "west-yorkshire-durood-settings";
const counts = JSON.parse(localStorage.getItem(countsKey) || "{}");
const settings = JSON.parse(localStorage.getItem(settingsKey) || "{}");
let count = 0;
let target = Number(settings.target) || 100;

Object.entries(duroods).forEach(([key, durood]) => {
  const option = document.createElement("option");
  option.value = key;
  option.textContent = durood.name;
  select.append(option);
});
select.value = settings.durood || "ibrahim";
targetSelect.value = ["33", "100", "313", "1000"].includes(String(target)) ? String(target) : "custom";
customTarget.value = target;
customDurood.value = settings.customText || "";

function save() {
  counts[select.value] = count;
  localStorage.setItem(countsKey, JSON.stringify(counts));
  localStorage.setItem(settingsKey, JSON.stringify({ durood: select.value, target, customText: customDurood.value }));
}

function updateCount() {
  countOutput.value = count;
  countOutput.textContent = count.toLocaleString();
  progress.max = target;
  progress.value = Math.min(count, target);
  targetStatus.textContent = `${count.toLocaleString()} of ${target.toLocaleString()}`;
  save();
}

function updateDurood() {
  const durood = duroods[select.value];
  document.getElementById("durood-title").textContent = durood.name;
  customDuroodWrap.hidden = select.value !== "custom";
  document.getElementById("duroodText").textContent = select.value === "custom" ? customDurood.value : durood.arabic;
  count = Number(counts[select.value]) || 0;
  updateCount();
}

function updateTarget() {
  if (targetSelect.value !== "custom") customTarget.value = targetSelect.value;
  target = Math.max(1, Number.parseInt(customTarget.value, 10) || 1);
  updateCount();
}

document.getElementById("add").addEventListener("click", () => {
  count++;
  updateCount();
});
document.getElementById("minus").addEventListener("click", () => {
  count = Math.max(0, count - 1);
  updateCount();
});
document.getElementById("reset").addEventListener("click", () => {
  count = 0;
  updateCount();
});
select.addEventListener("change", updateDurood);
targetSelect.addEventListener("change", updateTarget);
customTarget.addEventListener("input", () => {
  targetSelect.value = "custom";
  updateTarget();
});
customDurood.addEventListener("input", () => {
  if (select.value === "custom") document.getElementById("duroodText").textContent = customDurood.value;
  save();
});
counter.addEventListener("click", (event) => {
  if (event.target.closest("button, input, select, textarea, label, a")) return;
  count++;
  updateCount();
});
updateDurood();
