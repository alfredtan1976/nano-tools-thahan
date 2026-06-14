const siteUrl = "https://thahan.nano-tools.net";
const pageLang = document.documentElement.lang === "en" || document.body.dataset.lang === "en" ? "en" : "th";

const copy = {
  th: {
    locale: "th-TH",
    branchNames: {
      army: "ทหารบก",
      navy: "ทหารเรือ",
      airforce: "ทหารอากาศ",
    },
    batches: {
      p1May: "ผลัด 1 · 1 พฤษภาคม",
      p2Nov: "ผลัด 2 · 1 พฤศจิกายน",
      p2Aug: "ผลัด 2 · 1 สิงหาคม",
      p3Nov: "ผลัด 3 · 1 พฤศจิกายน",
      p4Feb: "ผลัด 4 · 1 กุมภาพันธ์",
    },
    educationNames: {
      basic: "มัธยม / ไม่มีสิทธิลดหย่อน",
      degree: "อนุปริญญา / ปริญญาตรี",
      rordor2: "จบ รด. ปี 2",
      rordor3: "จบ รด. ปี 3 ขึ้นไป",
    },
    day: "วัน",
    exempt: "ได้รับการยกเว้น",
    exemptNote: "จบ รด. ปี 3 ขึ้นไป โปรดตรวจสอบเอกสารกับสัสดี",
    timeParts: ["ชั่วโมง", "นาที", "วินาที"],
    elapsed: "ผ่านไป",
    remaining: "เหลือ",
    rank: ["พลทหารใหม่", "พลทหาร", "พลทหารอาวุโส", "ใกล้ปลดประจำการ"],
    paydayPrefix: "",
    leavePast: "วันลาผ่านไปแล้ว",
    leaveUnset: "ยังไม่ได้ตั้ง",
    discharge: "ปลด",
    specialRule: "กรณีพิเศษ / ขาดทหาร · บังคับนับ 2 ปี",
    specialShare: "กรณีพิเศษ / ขาดทหาร · นับ 2 ปี",
    saved: "บันทึกแล้ว เปิดดูได้ทุกวัน",
    saveButton: "บันทึกไว้ให้แฟนทหารดู",
    download: "ดาวน์โหลดรูปแชร์ PNG",
    shareTitle: "CountDownทหาร",
    shareExempt: "ยกเว้น",
    shareExemptNote: "โปรดตรวจสอบเอกสาร",
    shareDaysToDischarge: "วันถึงปลดประจำการ",
    shareServed: "รับราชการแล้ว",
    shareStart: "เข้า",
    shareEnd: "ปลด",
    shareRight: "สิทธิ",
    shareLove: "บันทึกไว้ให้แฟนทหารดู แล้วนับไปด้วยกัน",
    shareDisclaimer: "วันจริงควรตรวจสอบกับหน่วยหรือเอกสารราชการอีกครั้ง",
    shareUrlLabel: "คำนวณวันปลดทหารได้ที่",
  },
  en: {
    locale: "en-US",
    branchNames: {
      army: "Royal Thai Army",
      navy: "Royal Thai Navy",
      airforce: "Royal Thai Air Force",
    },
    batches: {
      p1May: "Batch 1 · May 1",
      p2Nov: "Batch 2 · November 1",
      p2Aug: "Batch 2 · August 1",
      p3Nov: "Batch 3 · November 1",
      p4Feb: "Batch 4 · February 1",
    },
    educationNames: {
      basic: "High school or lower / no reduction",
      degree: "Diploma / bachelor's degree",
      rordor2: "Completed Ror Dor year 2",
      rordor3: "Completed Ror Dor year 3+",
    },
    day: "days",
    exempt: "Exempt",
    exemptNote: "Ror Dor year 3+ is usually exempt. Please verify with the recruiting office.",
    timeParts: ["hours", "minutes", "seconds"],
    elapsed: "Elapsed",
    remaining: "Remaining",
    rank: ["New conscript", "Conscript", "Senior conscript", "Close to discharge"],
    paydayPrefix: "",
    leavePast: "Leave date has passed",
    leaveUnset: "Not set",
    discharge: "Discharge",
    specialRule: "Special case / absent from draft · forced 2-year service",
    specialShare: "Special case / absent from draft · 2 years",
    saved: "Saved. Open this site anytime.",
    saveButton: "Save for my partner/family",
    download: "Download PNG",
    shareTitle: "Thai Military Countdown",
    shareExempt: "Exempt",
    shareExemptNote: "Please verify documents",
    shareDaysToDischarge: "days to discharge",
    shareServed: "Service completed",
    shareStart: "Start",
    shareEnd: "End",
    shareRight: "Status",
    shareLove: "Save it and count down together",
    shareDisclaimer: "Verify official dates with your unit or documents",
    shareUrlLabel: "Calculate your discharge date at",
  },
};

const t = copy[pageLang];
const branchNames = t.branchNames;

const batchOptions = {
  army: [
    { value: "p1", label: t.batches.p1May, month: 4, day: 1 },
    { value: "p2", label: t.batches.p2Nov, month: 10, day: 1 },
  ],
  navy: [
    { value: "p1", label: t.batches.p1May, month: 4, day: 1 },
    { value: "p2", label: t.batches.p2Aug, month: 7, day: 1 },
    { value: "p3", label: t.batches.p3Nov, month: 10, day: 1 },
    { value: "p4", label: t.batches.p4Feb, month: 1, day: 1 },
  ],
  airforce: [
    { value: "p1", label: t.batches.p1May, month: 4, day: 1 },
    { value: "p2", label: t.batches.p2Nov, month: 10, day: 1 },
  ],
};

const educationNames = t.educationNames;

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
  return new Intl.DateTimeFormat(t.locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function pluralDays(days) {
  return `${Math.max(0, Math.ceil(days)).toLocaleString(t.locale)} ${t.day}`;
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
  if (totalMonths === 0) return t.exempt;
  if (monthsServed < 3) return t.rank[0];
  if (monthsServed < 12) return t.rank[1];
  if (monthsServed < 18) return t.rank[2];
  return t.rank[3];
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

  daysLeftEl.textContent = serviceMonths === 0 ? t.exempt : `${remainingDays.toLocaleString(t.locale)} ${t.day}`;
  timeLeftEl.textContent =
    serviceMonths === 0
      ? t.exemptNote
      : `${pad(hours)} ${t.timeParts[0]} ${pad(minutes)} ${t.timeParts[1]} ${pad(seconds)} ${t.timeParts[2]}`;
  servedPercentEl.textContent = `${percent.toFixed(5)}%`;
  progressFill.style.width = `${Math.min(percent, 100)}%`;
  elapsedLabel.textContent = `${t.elapsed} ${elapsedDays.toLocaleString(t.locale)} ${t.day}`;
  remainingLabel.textContent = `${t.remaining} ${remainingDays.toLocaleString(t.locale)} ${t.day}`;
  rankLabel.textContent = getRankLabel(monthsServed, serviceMonths);
  paydayLabel.textContent = `${pluralDays(paydayDays)} · ${formatThaiDate(nextPayday)}`;

  if (currentResult.leaveDate) {
    const leaveDays = Math.ceil((currentResult.leaveDate - now) / 86400000);
    leaveLabel.textContent =
      leaveDays >= 0 ? `${pluralDays(leaveDays)} · ${formatThaiDate(currentResult.leaveDate)}` : t.leavePast;
  } else {
    leaveLabel.textContent = t.leaveUnset;
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

  const ruleLabel = result.specialCase ? t.specialRule : `${t.discharge} ${formatThaiDate(result.endDate)}`;
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

function setCanvasFont(ctx, weight, size) {
  const family = pageLang === "en" ? "Arial, Helvetica, sans-serif" : "system-ui, sans-serif";
  ctx.font = `${weight} ${size}px ${family}`;
}

function drawFittedText(ctx, text, x, y, maxWidth, weight, size, minSize = 24) {
  let currentSize = size;
  setCanvasFont(ctx, weight, currentSize);
  while (ctx.measureText(text).width > maxWidth && currentSize > minSize) {
    currentSize -= 2;
    setCanvasFont(ctx, weight, currentSize);
  }
  ctx.fillText(text, x, y);
  return currentSize;
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, weight, size, maxLines = 2) {
  setCanvasFont(ctx, weight, size);
  const words = text.split(" ");
  const lines = [];
  let line = "";

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width <= maxWidth || !line) {
      line = testLine;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);

  const visibleLines = lines.slice(0, maxLines);
  if (lines.length > maxLines) {
    let last = visibleLines[visibleLines.length - 1];
    while (ctx.measureText(`${last}...`).width > maxWidth && last.length > 0) {
      last = last.slice(0, -1);
    }
    visibleLines[visibleLines.length - 1] = `${last}...`;
  }

  visibleLines.forEach((visibleLine, index) => {
    ctx.fillText(visibleLine, x, y + index * lineHeight);
  });
  return visibleLines.length;
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
  drawFittedText(ctx, t.shareTitle, 86, 128, 680, "800", 54, 34);
  ctx.fillStyle = "#aee6d0";
  drawWrappedText(ctx, `${branchNames[currentResult.branch]} · ${currentResult.batch.label}`, 86, 184, 760, 42, "600", 34, 2);

  ctx.fillStyle = "#ffffff";
  drawFittedText(ctx, currentResult.serviceMonths === 0 ? t.shareExempt : `${remainingDays}`, 86, 440, 720, "900", 154, 82);
  drawFittedText(ctx, currentResult.serviceMonths === 0 ? t.shareExemptNote : t.shareDaysToDischarge, 96, 520, 870, "800", 56, 34);

  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.fillRect(86, 660, 908, 44);
  ctx.fillStyle = "#f4b942";
  ctx.fillRect(86, 660, 908 * (percent / 100), 44);
  ctx.fillStyle = "#ffffff";
  drawFittedText(ctx, `${t.shareServed} ${percent.toFixed(5)}%`, 86, 790, 908, "800", 46, 28);

  ctx.fillStyle = "#d8f3e9";
  drawFittedText(ctx, `${t.shareStart}: ${formatThaiDate(currentResult.startDate)}`, 86, 890, 908, "600", 34, 24);
  drawFittedText(ctx, `${t.shareEnd}: ${formatThaiDate(currentResult.endDate)}`, 86, 946, 908, "600", 34, 24);
  drawFittedText(ctx, `${t.shareRight}: ${currentResult.specialCase ? t.specialShare : educationNames[currentResult.education]}`, 86, 1002, 908, "600", 34, 22);

  ctx.fillStyle = "#ffffff";
  drawFittedText(ctx, t.shareLove, 86, 1126, 908, "800", 38, 24);
  ctx.fillStyle = "#aee6d0";
  drawFittedText(ctx, t.shareDisclaimer, 86, 1182, 908, "600", 28, 19);

  ctx.fillStyle = "rgba(255,255,255,0.14)";
  ctx.fillRect(86, 1236, 908, 70);
  ctx.fillStyle = "#ffffff";
  drawFittedText(ctx, t.shareUrlLabel, 116, 1280, 390, "800", 32, 22);
  ctx.fillStyle = "#f4b942";
  drawFittedText(ctx, siteUrl.replace("https://", ""), 522, 1280, 430, "900", 34, 22);

  const imageUrl = shareCanvas.toDataURL("image/png");
  downloadCard.href = imageUrl;
  downloadCard.hidden = false;
  downloadCard.textContent = t.download;
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
  saveFavoriteButton.textContent = t.saved;
  setTimeout(() => {
    saveFavoriteButton.textContent = t.saveButton;
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
  if (languageToggle.tagName === "A") {
    return;
  }
  if (languageToggle.dataset.href) {
    window.location.href = languageToggle.dataset.href;
    return;
  }
  window.location.href = pageLang === "en" ? "index.html" : "en.html";
});

restoreState();
