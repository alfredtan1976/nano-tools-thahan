const branchNames = {
  army: "ทหารบก",
  navy: "ทหารเรือ",
  airforce: "ทหารอากาศ",
};

const siteUrl = "https://thahan.nano-tools.net";

const batchOptions = {
  army: [
    { value: "p1", label: "ผลัด 1 · 1 พฤษภาคม", month: 4, day: 1 },
    { value: "p2", label: "ผลัด 2 · 1 พฤศจิกายน", month: 10, day: 1 },
  ],
  navy: [
    { value: "p1", label: "ผลัด 1 · 1 พฤษภาคม", month: 4, day: 1 },
    { value: "p2", label: "ผลัด 2 · 1 สิงหาคม", month: 7, day: 1 },
    { value: "p3", label: "ผลัด 3 · 1 พฤศจิกายน", month: 10, day: 1 },
    { value: "p4", label: "ผลัด 4 · 1 กุมภาพันธ์", month: 1, day: 1 },
  ],
  airforce: [
    { value: "p1", label: "ผลัด 1 · 1 พฤษภาคม", month: 4, day: 1 },
    { value: "p2", label: "ผลัด 2 · 1 พฤศจิกายน", month: 10, day: 1 },
  ],
};

const educationNames = {
  basic: "มัธยม / ไม่มีสิทธิลดหย่อน",
  degree: "อนุปริญญา / ปริญญาตรี",
  rordor2: "จบ รด. ปี 2",
  rordor3: "จบ รด. ปี 3 ขึ้นไป",
};

const form = document.querySelector("#serviceForm");
const branchSelect = document.querySelector("#branch");
const batchSelect = document.querySelector("#batch");
const entryYearInput = document.querySelector("#entryYear");
const calculatorSection = document.querySelector("#calculatorSection");
const dashboardSection = document.querySelector("#dashboardSection");
const resetButton = document.querySelector("#resetButton");
const daysLeftEl = document.querySelector("#daysLeft");
const timeLeftEl = document.querySelector("#timeLeft");
const servedPercentEl = document.querySelector("#servedPercent");
const progressFill = document.querySelector("#progressFill");
const elapsedLabel = document.querySelector("#elapsedLabel");
const remainingLabel = document.querySelector("#remainingLabel");
const rankLabel = document.querySelector("#rankLabel");
const paydayLabel = document.querySelector("#paydayLabel");
const leaveLabel = document.querySelector("#leaveLabel");
const serviceLabel = document.querySelector("#serviceLabel");
const shareCardButton = document.querySelector("#shareCardButton");
const saveFavoriteButton = document.querySelector("#saveFavoriteButton");
const shareCanvas = document.querySelector("#shareCanvas");
const downloadCard = document.querySelector("#downloadCard");
const specialCaseInput = document.querySelector("#specialCase");
const rememberInfoInput = document.querySelector("#rememberInfo");
const languageToggle = document.querySelector("#languageToggle");
const shareModal = document.querySelector("#shareModal");
const sharePreview = document.querySelector("#sharePreview");
const closeShareModal = document.querySelector("#closeShareModal");
const downloadCardModal = document.querySelector("#downloadCardModal");

let activeTimer;
let currentResult;

function pad(number) {
  return String(number).padStart(2, "0");
}

function formatThaiDate(date) {
  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function pluralDays(days) {
  return `${Math.max(0, Math.ceil(days)).toLocaleString("th-TH")} วัน`;
}

function fillBatchOptions() {
  const options = batchOptions[branchSelect.value];
  batchSelect.innerHTML = "";
  for (const option of options) {
    const node = document.createElement("option");
    node.value = option.value;
    node.textContent = option.label;
    batchSelect.append(node);
  }
}

function addMonths(date, months) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function getServiceMonths(entryType, education, specialCase) {
  if (specialCase) return 24;
  if (education === "rordor3") return 0;
  if (education === "rordor2") return entryType === "volunteer" ? 6 : 12;
  if (education === "degree") return entryType === "volunteer" ? 6 : 12;
  return entryType === "volunteer" ? 12 : 24;
}

function getRankLabel(monthsServed, totalMonths) {
  if (totalMonths === 0) return "ได้รับการยกเว้น";
  if (monthsServed < 3) return "พลทหารใหม่";
  if (monthsServed < 12) return "พลทหาร";
  if (monthsServed < 18) return "พลทหารอาวุโส";
  return "ใกล้ปลดประจำการ";
}

function getNextPayday(dayOfMonth, now) {
  const candidate = new Date(now.getFullYear(), now.getMonth(), dayOfMonth, 9, 0, 0);
  if (candidate <= now) {
    candidate.setMonth(candidate.getMonth() + 1);
  }
  return candidate;
}

function calculateResult(values) {
  const batch = batchOptions[values.branch].find((item) => item.value === values.batch);
  const startDate = new Date(Number(values.entryYear), batch.month, batch.day, 8, 0, 0);
  const serviceMonths = getServiceMonths(values.entryType, values.education, values.specialCase);
  const endDate = serviceMonths === 0 ? startDate : addMonths(startDate, serviceMonths);
  const leaveDate = values.leaveDate ? new Date(`${values.leaveDate}T08:00:00`) : null;

  return {
    ...values,
    batch,
    startDate,
    endDate,
    serviceMonths,
    leaveDate,
  };
}

function updateDashboard() {
  if (!currentResult) return;

  const now = new Date();
  const { startDate, endDate, serviceMonths } = currentResult;
  const totalMs = Math.max(1, endDate - startDate);
  const elapsedMs = Math.min(Math.max(now - startDate, 0), totalMs);
  const remainingMs = Math.max(endDate - now, 0);
  const elapsedDays = Math.floor(elapsedMs / 86400000);
  const remainingDays = Math.ceil(remainingMs / 86400000);
  const percent = serviceMonths === 0 ? 100 : (elapsedMs / totalMs) * 100;
  const hours = Math.floor((remainingMs / 3600000) % 24);
  const minutes = Math.floor((remainingMs / 60000) % 60);
  const seconds = Math.floor((remainingMs / 1000) % 60);
  const monthsServed = elapsedMs / (1000 * 60 * 60 * 24 * 30.4375);
  const nextPayday = getNextPayday(Number(currentResult.payday), now);
  const paydayDays = Math.ceil((nextPayday - now) / 86400000);

  daysLeftEl.textContent = serviceMonths === 0 ? "ได้รับการยกเว้น" : `${remainingDays.toLocaleString("th-TH")} วัน`;
  timeLeftEl.textContent =
    serviceMonths === 0
      ? "จบ รด. ปี 3 ขึ้นไป โปรดตรวจสอบเอกสารกับสัสดี"
      : `${pad(hours)} ชั่วโมง ${pad(minutes)} นาที ${pad(seconds)} วินาที`;
  servedPercentEl.textContent = `${percent.toFixed(5)}%`;
  progressFill.style.width = `${Math.min(percent, 100)}%`;
  elapsedLabel.textContent = `ผ่านไป ${elapsedDays.toLocaleString("th-TH")} วัน`;
  remainingLabel.textContent = `เหลือ ${remainingDays.toLocaleString("th-TH")} วัน`;
  rankLabel.textContent = getRankLabel(monthsServed, serviceMonths);
  paydayLabel.textContent = `${pluralDays(paydayDays)} · ${formatThaiDate(nextPayday)}`;

  if (currentResult.leaveDate) {
    const leaveDays = Math.ceil((currentResult.leaveDate - now) / 86400000);
    leaveLabel.textContent =
      leaveDays >= 0 ? `${pluralDays(leaveDays)} · ${formatThaiDate(currentResult.leaveDate)}` : "วันลาผ่านไปแล้ว";
  } else {
    leaveLabel.textContent = "ยังไม่ได้ตั้ง";
  }
}

function saveState(result) {
  localStorage.setItem("countdownThahan", JSON.stringify({
    branch: result.branch,
    batch: result.batch.value,
    entryYear: result.entryYear,
    entryType: result.entryType,
    education: result.education,
    specialCase: result.specialCase,
    payday: result.payday,
    leaveDate: result.leaveDate ? result.leaveDate.toISOString().slice(0, 10) : "",
  }));
}

function readFormValues() {
  return {
    branch: branchSelect.value,
    batch: batchSelect.value,
    entryYear: entryYearInput.value,
    entryType: document.querySelector("#entryType").value,
    education: document.querySelector("#education").value,
    specialCase: specialCaseInput.checked,
    rememberInfo: rememberInfoInput.checked,
    payday: document.querySelector("#payday").value,
    leaveDate: document.querySelector("#leaveDate").value,
  };
}

function showDashboard(result, saveMode = "auto") {
  currentResult = result;
  if (saveMode === "save" || (saveMode === "auto" && result.rememberInfo)) {
    saveState(result);
  } else if (saveMode === "auto") {
    localStorage.removeItem("countdownThahan");
  }

  const ruleLabel = result.specialCase ? "กรณีพิเศษ / ขาดทหาร · บังคับนับ 2 ปี" : `ปลด ${formatThaiDate(result.endDate)}`;
  serviceLabel.textContent = `${branchNames[result.branch]} · ${result.batch.label} · ${ruleLabel}`;
  calculatorSection.hidden = true;
  dashboardSection.hidden = false;
  resetButton.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });

  clearInterval(activeTimer);
  updateDashboard();
  activeTimer = setInterval(updateDashboard, 1000);
}

function restoreState() {
  const raw = localStorage.getItem("countdownThahan");
  if (!raw) return;

  try {
    const state = JSON.parse(raw);
    branchSelect.value = state.branch || "army";
    fillBatchOptions();
    batchSelect.value = state.batch || "p1";
    entryYearInput.value = state.entryYear || new Date().getFullYear();
    document.querySelector("#entryType").value = state.entryType || "lottery";
    document.querySelector("#education").value = state.education || "basic";
    specialCaseInput.checked = Boolean(state.specialCase);
    rememberInfoInput.checked = true;
    document.querySelector("#payday").value = state.payday || "25";
    document.querySelector("#leaveDate").value = state.leaveDate || "";
    showDashboard(calculateResult(readFormValues()), "restore");
  } catch {
    localStorage.removeItem("countdownThahan");
  }
}

function drawShareCard() {
  if (!currentResult) return;

  const ctx = shareCanvas.getContext("2d");
  const now = new Date();
  const remainingMs = Math.max(currentResult.endDate - now, 0);
  const remainingDays = Math.ceil(remainingMs / 86400000);
  const percent = currentResult.serviceMonths === 0
    ? 100
    : Math.min(Math.max(((now - currentResult.startDate) / (currentResult.endDate - currentResult.startDate)) * 100, 0), 100);

  ctx.clearRect(0, 0, shareCanvas.width, shareCanvas.height);
  ctx.fillStyle = "#f7f9fc";
  ctx.fillRect(0, 0, shareCanvas.width, shareCanvas.height);
  ctx.fillStyle = "#0a513c";
  ctx.fillRect(0, 0, shareCanvas.width, 1350);
  ctx.fillStyle = "#116a50";
  ctx.beginPath();
  ctx.arc(880, 180, 280, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f4b942";
  ctx.beginPath();
  ctx.arc(910, 210, 150, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "800 54px system-ui, sans-serif";
  ctx.fillText("CountDownทหาร", 86, 128);
  ctx.font = "600 34px system-ui, sans-serif";
  ctx.fillStyle = "#aee6d0";
  ctx.fillText(`${branchNames[currentResult.branch]} · ${currentResult.batch.label}`, 86, 184);

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 154px system-ui, sans-serif";
  ctx.fillText(currentResult.serviceMonths === 0 ? "ยกเว้น" : `${remainingDays}`, 86, 440);
  ctx.font = "800 56px system-ui, sans-serif";
  ctx.fillText(currentResult.serviceMonths === 0 ? "โปรดตรวจสอบเอกสาร" : "วันถึงปลดประจำการ", 96, 520);

  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.fillRect(86, 660, 908, 44);
  ctx.fillStyle = "#f4b942";
  ctx.fillRect(86, 660, 908 * (percent / 100), 44);
  ctx.fillStyle = "#ffffff";
  ctx.font = "800 46px system-ui, sans-serif";
  ctx.fillText(`รับราชการแล้ว ${percent.toFixed(5)}%`, 86, 790);

  ctx.font = "600 34px system-ui, sans-serif";
  ctx.fillStyle = "#d8f3e9";
  ctx.fillText(`เข้า: ${formatThaiDate(currentResult.startDate)}`, 86, 890);
  ctx.fillText(`ปลด: ${formatThaiDate(currentResult.endDate)}`, 86, 946);
  ctx.fillText(`สิทธิ: ${currentResult.specialCase ? "กรณีพิเศษ / ขาดทหาร · นับ 2 ปี" : educationNames[currentResult.education]}`, 86, 1002);

  ctx.fillStyle = "#ffffff";
  ctx.font = "800 38px system-ui, sans-serif";
  ctx.fillText("บันทึกไว้ให้แฟนทหารดู แล้วนับไปด้วยกัน", 86, 1126);
  ctx.font = "600 28px system-ui, sans-serif";
  ctx.fillStyle = "#aee6d0";
  ctx.fillText("วันจริงควรตรวจสอบกับหน่วยหรือเอกสารราชการอีกครั้ง", 86, 1182);

  ctx.fillStyle = "rgba(255,255,255,0.14)";
  ctx.fillRect(86, 1236, 908, 70);
  ctx.fillStyle = "#ffffff";
  ctx.font = "800 32px system-ui, sans-serif";
  ctx.fillText("คำนวณวันปลดทหารได้ที่", 116, 1280);
  ctx.fillStyle = "#f4b942";
  ctx.font = "900 34px system-ui, sans-serif";
  ctx.fillText(siteUrl.replace("https://", ""), 522, 1280);

  const imageUrl = shareCanvas.toDataURL("image/png");
  downloadCard.href = imageUrl;
  downloadCard.hidden = false;
  downloadCard.textContent = "ดาวน์โหลดรูปแชร์ PNG";
  downloadCardModal.href = imageUrl;
  sharePreview.src = imageUrl;
  shareModal.hidden = false;
}

fillBatchOptions();
entryYearInput.value = new Date().getFullYear();
branchSelect.addEventListener("change", fillBatchOptions);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  showDashboard(calculateResult(readFormValues()), "auto");
});

resetButton.addEventListener("click", () => {
  clearInterval(activeTimer);
  currentResult = null;
  dashboardSection.hidden = true;
  calculatorSection.hidden = false;
  resetButton.hidden = true;
  downloadCard.hidden = true;
  shareModal.hidden = true;
  window.scrollTo({ top: 0, behavior: "smooth" });
});

shareCardButton.addEventListener("click", drawShareCard);
saveFavoriteButton.addEventListener("click", () => {
  if (currentResult) {
    currentResult.rememberInfo = true;
    rememberInfoInput.checked = true;
    saveState(currentResult);
  }
  saveFavoriteButton.textContent = "บันทึกแล้ว เปิดดูได้ทุกวัน";
  setTimeout(() => {
    saveFavoriteButton.textContent = "บันทึกไว้ให้แฟนทหารดู";
  }, 2200);
});

closeShareModal.addEventListener("click", () => {
  shareModal.hidden = true;
});

shareModal.addEventListener("click", (event) => {
  if (event.target === shareModal) {
    shareModal.hidden = true;
  }
});

languageToggle.addEventListener("click", () => {
  const nextLanguage = localStorage.getItem("countdownThahanLanguage") === "en" ? "th" : "en";
  localStorage.setItem("countdownThahanLanguage", nextLanguage);
  languageToggle.textContent = nextLanguage === "en" ? "EN / TH" : "TH / EN";
  languageToggle.title = nextLanguage === "en" ? "English version reserved" : "ภาษาไทย";
});

if (localStorage.getItem("countdownThahanLanguage") === "en") {
  languageToggle.textContent = "EN / TH";
  languageToggle.title = "English version reserved";
}

restoreState();
