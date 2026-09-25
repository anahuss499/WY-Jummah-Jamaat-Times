/* Renders the page from data.js. You should not need to edit this file. */
(function () {
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const slug = (s) => "a-" + s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  /* ---- Header ---- */
  const d = new Date(CONFIG.date + "T12:00:00");
  const day = d.getDate();
  const suffix = day % 10 === 1 && day !== 11 ? "st" : day % 10 === 2 && day !== 12 ? "nd" : day % 10 === 3 && day !== 13 ? "rd" : "th";
  $("season").textContent = CONFIG.season;
  $("title").textContent = CONFIG.title;
  $("subtitle").textContent = CONFIG.subtitle;
  $("tagline").textContent = CONFIG.tagline;
  $("datepill").innerHTML =
    `<span class="dow">${d.toLocaleDateString("en-GB", { weekday: "long" })}</span>` +
    `<span class="day">${day}<small>${suffix}</small></span>` +
    `<span class="my"><span>${d.toLocaleDateString("en-GB", { month: "long" })}</span><span>${d.getFullYear()}</span></span>`;
  document.title = `${CONFIG.title} ${CONFIG.subtitle} – ${day} ${d.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}`;

  $("phone").textContent = CONFIG.phone;
  $("phone").href = "tel:" + CONFIG.phone.replace(/\s/g, "");
  $("email").textContent = CONFIG.email;
  $("email").href = "mailto:" + CONFIG.email;
  const qrSvg = (text, color) => {
    const q = qrcode(0, "M"); q.addData(text); q.make();
    const n = q.getModuleCount(); let p = "";
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) p += `M${c} ${r}h1v1h-1z`;
    return `<svg viewBox="-2 -2 ${n + 4} ${n + 4}" shape-rendering="crispEdges" role="img" aria-hidden="true"><path d="${p}" fill="${color}"/></svg>`;
  };
  $("social").innerHTML = (CONFIG.social || []).map((s) => {
    const link = s.url ? `href="${esc(s.url)}" target="_blank" rel="noopener"` : 'role="link" aria-disabled="true"';
    const qr = s.url ? `<a class="qr" ${link} style="background:${esc(s.bg || "#fff")}" aria-label="${esc(s.name)} QR code" title="Scan for ${esc(s.name)}">${qrSvg(s.url, s.color || "#000")}</a>` : "";
    return `<div class="sc"><a class="soc" ${link} aria-label="${esc(s.name)}" title="${esc(s.name)}"><i class="${esc(s.icon)}"></i></a>${qr}<span class="lab">${esc(s.label || s.name)}</span></div>`;
  }).join("");
  $("whatsappChannels").innerHTML = (CONFIG.whatsappChannels || []).map((channel) =>
    `<a class="channel" href="${esc(channel.url)}" target="_blank" rel="noopener">` +
      `<strong>${esc(channel.name)}</strong><span>${esc(channel.description)}</span><b>${esc(channel.url)}</b>` +
    `</a>`
  ).join("");

  /* ---- Build list ---- */
  const labels = ["1st", "2nd", "3rd"];
  const areaLinks = AREAS.map((a) => `<a href="#${slug(a.area)}">${esc(a.area)}</a>`).join("");
  $("areaNav").innerHTML = areaLinks;
  $("areaNavMobile").innerHTML = areaLinks;

  $("list").innerHTML = AREAS.map((a) => {
    const rows = a.masjids.map(([name, addr, times, flags = ""]) => {
      const ladies = flags.includes("L"), upd = flags.includes("U");
      const late = times.some((t) => t.endsWith("+"));
      const cells = labels.map((l, i) => {
        const t = times[i];
        if (!t) return `<div class="t none" data-l="${l}"></div>`;
        const isLate = t.endsWith("+");
        return `<div class="t${isLate ? " late" : ""}" data-l="${l}">${esc(t.replace("+", ""))}</div>`;
      }).join("");
      const search = (name + " " + addr + " " + a.area).toLowerCase();
      const maps = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(name + ", " + addr);
      return `<div class="row${ladies ? " ladies" : ""}${upd ? " upd" : ""}" data-s="${esc(search)}" data-ladies="${ladies}" data-late="${late}">
        <div class="info"><div class="name">${ladies ? '<span class="dot" title="Facilities for ladies"></span>' : ""}<b>${esc(name)}</b><button class="more-btn" type="button" data-name="${esc(name)}" data-address="${esc(addr)}" aria-label="More about ${esc(name)}">More</button></div>
        <span class="addr"><a href="${maps}" target="_blank" rel="noopener">${esc(addr)}</a></span></div>${cells}</div>`;
    }).join("");
    return `<section class="area" id="${slug(a.area)}"><h2>${esc(a.area)}</h2>
      <div class="rows"><div class="head"><span>Masjid &amp; address</span><span>1st</span><span>2nd</span><span>3rd</span></div>${rows}</div></section>`;
  }).join("");

  const mosqueDialog = $("mosqueDialog");
  const dialogTitle = $("mosqueDialogTitle");
  const dialogAddress = $("mosqueDialogAddress");
  const dialogLinks = $("mosqueDialogLinks");
  $("list").addEventListener("click", (event) => {
    const button = event.target.closest(".more-btn");
    if (!button) return;
    const name = button.dataset.name;
    const address = button.dataset.address;
    const query = `${name}, ${address}`;
    const encodedQuery = encodeURIComponent(query);
    const encodedName = encodeURIComponent(`${name} ${address}`);
    dialogTitle.textContent = name;
    dialogAddress.textContent = address;
    const timetableUrl = CONFIG.monthlyTimetableUrl || "";
    dialogLinks.innerHTML =
      `<a class="dialog-link map-link" href="https://www.google.com/maps/search/?api=1&query=${encodedQuery}" target="_blank" rel="noopener"><i class="fa-solid fa-location-dot"></i> Live location on map</a>` +
      (timetableUrl ? `<a class="dialog-link timetable-link" href="${esc(timetableUrl)}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i> Monthly prayer timetable on WhatsApp</a>` : "") +
      `<a class="dialog-link" href="https://www.google.com/search?q=${encodedName}+official+website" target="_blank" rel="noopener"><i class="fa-solid fa-globe"></i> Find official website</a>` +
      `<a class="dialog-link" href="https://www.google.com/search?q=${encodedName}+social+media" target="_blank" rel="noopener"><i class="fa-solid fa-share-nodes"></i> Find social profiles</a>`;
    mosqueDialog.showModal();
  });
  $("mosqueDialog").addEventListener("click", (event) => {
    if (event.target === mosqueDialog || event.target.closest(".dialog-close")) mosqueDialog.close();
  });

  /* ---- Search + filters ---- */
  const fLate = $("fLate"), fLadies = $("fLadies");
  [fLate, fLadies].forEach((b) => b.addEventListener("click", () => {
    b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") !== "true");
    apply();
  }));
  $("search").addEventListener("input", apply);

  function apply() {
    const q = $("search").value.trim().toLowerCase();
    const needLate = fLate.getAttribute("aria-pressed") === "true";
    const needLadies = fLadies.getAttribute("aria-pressed") === "true";
    let total = 0;
    document.querySelectorAll(".area").forEach((sec) => {
      let shown = 0;
      sec.querySelectorAll(".row").forEach((r) => {
        const ok = (!q || r.dataset.s.includes(q)) && (!needLate || r.dataset.late === "true") && (!needLadies || r.dataset.ladies === "true");
        r.classList.toggle("hide", !ok);
        if (ok) shown++;
      });
      sec.classList.toggle("hide", shown === 0);
      total += shown;
    });
    $("empty").hidden = total > 0;
  }
})();
