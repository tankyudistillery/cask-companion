/* Cask Companion — by Tankyu Distillery */
"use strict";

/* ---------- Tabs ---------- */
const tabCalc = document.getElementById("tab-calc");
const tabTrack = document.getElementById("tab-track");
const panelCalc = document.getElementById("panel-calc");
const panelTrack = document.getElementById("panel-track");

function activate(tab) {
  const calc = tab === "calc";
  tabCalc.classList.toggle("active", calc);
  tabTrack.classList.toggle("active", !calc);
  panelCalc.classList.toggle("active", calc);
  panelTrack.classList.toggle("active", !calc);
}
tabCalc.addEventListener("click", () => activate("calc"));
tabTrack.addEventListener("click", () => activate("track"));

/* ---------- Calculator ---------- */
const caskType = document.getElementById("caskType");
const fillVol = document.getElementById("fillVol");
const climate = document.getElementById("climate");
const customRateWrap = document.getElementById("customRateWrap");
const customRate = document.getElementById("customRate");

caskType.addEventListener("change", () => {
  if (caskType.value !== "custom") fillVol.value = caskType.value;
});

climate.addEventListener("change", () => {
  customRateWrap.classList.toggle("hidden", climate.value !== "custom");
});

document.getElementById("calcBtn").addEventListener("click", () => {
  const vol = parseFloat(fillVol.value);
  const abv = parseFloat(document.getElementById("fillAbv").value);
  const years = parseInt(document.getElementById("years").value, 10);
  const rate =
    climate.value === "custom" ? parseFloat(customRate.value) : parseFloat(climate.value);
  const price = parseFloat(document.getElementById("price").value);
  const bottling = document.getElementById("bottling").value;

  if (!vol || !abv || !years || !rate || vol <= 0 || years <= 0) return;

  // Volume lost to the angel's share, compounding yearly
  const remaining = vol * Math.pow(1 - rate / 100, years);
  const lostPct = ((vol - remaining) / vol) * 100;

  // In cool climates ABV drifts gently downward (alcohol evaporates
  // slightly faster than water). Rough heuristic: −0.25 %/yr cool,
  // +0.4 %/yr hot (subtropical).
  const abvDrift = rate >= 7 ? 0.4 : -0.25;
  const finalAbv = Math.min(75, Math.max(40, abv + abvDrift * years));

  // Bottle yield (700 ml)
  let bottleVol = remaining;
  if (bottling === "46" && finalAbv > 46) bottleVol = remaining * (finalAbv / 46);
  const bottles = Math.floor(bottleVol / 0.7);

  document.getElementById("rRemaining").textContent = remaining.toFixed(1);
  document.getElementById("rShare").textContent = lostPct.toFixed(1) + "%";
  document.getElementById("rAbv").textContent = finalAbv.toFixed(1) + "%";
  document.getElementById("rBottles").textContent = "~" + bottles;

  const costEl = document.getElementById("rCost");
  if (price && bottles > 0) {
    const per = Math.round(price / bottles);
    costEl.textContent =
      "≈ ¥" + per.toLocaleString("ja-JP") + " per bottle, before bottling costs and taxes";
    costEl.classList.remove("hidden");
  } else {
    costEl.classList.add("hidden");
  }

  document.getElementById("results").classList.remove("hidden");
});

/* ---------- My Cask tracker ---------- */
const setupEl = document.getElementById("trackSetup");
const viewEl = document.getElementById("trackView");
const DAY = 86400000;

const MILESTONES = [
  { years: 1, label: "First year — new-make character begins to soften" },
  { years: 2, label: "Two years — colour and cask influence deepen" },
  { years: 3, label: "Three years — meets the JSLMA Japanese whisky standard" },
  { years: 5, label: "Five years — a classic first bottling age" },
  { years: 10, label: "Ten years — patience, rewarded" }
];

function renderCask(c) {
  setupEl.classList.add("hidden");
  viewEl.classList.remove("hidden");

  document.getElementById("vName").textContent = c.name || "My cask";

  const start = new Date(c.fillDate).getTime();
  const end = start + c.years * 365.25 * DAY;
  const now = Date.now();

  const elapsedDays = Math.max(0, Math.floor((now - start) / DAY));
  const leftDays = Math.max(0, Math.ceil((end - now) / DAY));
  const pct = Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));

  document.getElementById("vBar").style.width = pct.toFixed(1) + "%";
  document.getElementById("vPct").textContent =
    pct >= 100 ? "Ready to bottle 🥃" : pct.toFixed(1) + "% of the way to bottling";
  document.getElementById("vElapsed").textContent = elapsedDays.toLocaleString();
  document.getElementById("vLeft").textContent = leftDays.toLocaleString();

  const ul = document.getElementById("vMilestones");
  ul.innerHTML = "";
  MILESTONES.filter((m) => m.years <= Math.max(c.years, 3)).forEach((m) => {
    const li = document.createElement("li");
    li.textContent = m.label;
    if (now >= start + m.years * 365.25 * DAY) li.classList.add("done");
    ul.appendChild(li);
  });
}

document.getElementById("saveCask").addEventListener("click", () => {
  const cask = {
    name: document.getElementById("tName").value.trim(),
    fillDate: document.getElementById("tDate").value,
    years: parseInt(document.getElementById("tYears").value, 10)
  };
  if (!cask.fillDate || !cask.years) return;
  chrome.storage.local.set({ cask }, () => renderCask(cask));
});

document.getElementById("resetCask").addEventListener("click", () => {
  chrome.storage.local.remove("cask", () => {
    viewEl.classList.add("hidden");
    setupEl.classList.remove("hidden");
  });
});

chrome.storage.local.get("cask", ({ cask }) => {
  if (cask && cask.fillDate) renderCask(cask);
});
