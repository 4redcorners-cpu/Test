const dateLabel = document.getElementById("dateLabel");
const timezoneLabel = document.getElementById("timezoneLabel");

const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

const digitalClock = document.getElementById("digitalClock");
const analogClock = document.getElementById("analogClock");
const modeToggle = document.getElementById("modeToggle");
const themeToggle = document.getElementById("themeToggle");

const hourHand = document.getElementById("hourHand");
const minuteHand = document.getElementById("minuteHand");
const secondHand = document.getElementById("secondHand");
const numbersContainer = document.querySelector(".numbers");

const THEME_KEY = "clock-theme";
const MODE_KEY = "clock-mode";

function getStorageItem(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // localStorage может быть недоступен (например, в private mode).
  }
}

function pad(number) {
  return String(number).padStart(2, "0");
}

function createDialNumbers() {
  if (!numbersContainer) return;

  numbersContainer.innerHTML = "";

  for (let number = 1; number <= 12; number += 1) {
    const mark = document.createElement("span");
    const angle = number * 30;

    mark.textContent = String(number);
    mark.style.setProperty("--angle", `${angle}deg`);
    numbersContainer.appendChild(mark);
  }
}

function updateClock() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  if (hoursEl) hoursEl.textContent = pad(hours);
  if (minutesEl) minutesEl.textContent = pad(minutes);
  if (secondsEl) secondsEl.textContent = pad(seconds);

  if (dateLabel) {
    const dayText = now.toLocaleDateString("ru-RU", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    dateLabel.textContent = dayText;
  }

  if (timezoneLabel) {
    timezoneLabel.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  const hourRotation = (hours % 12) * 30 + minutes * 0.5 + seconds * (0.5 / 60);
  const minuteRotation = minutes * 6 + seconds * 0.1;
  const secondRotation = seconds * 6;

  if (hourHand) hourHand.style.transform = `translateX(-50%) rotate(${hourRotation}deg)`;
  if (minuteHand) minuteHand.style.transform = `translateX(-50%) rotate(${minuteRotation}deg)`;
  if (secondHand) secondHand.style.transform = `translateX(-50%) rotate(${secondRotation}deg)`;
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark", isDark);

  if (themeToggle) {
    themeToggle.textContent = isDark ? "Светлая тема" : "Тёмная тема";
    themeToggle.setAttribute("aria-pressed", String(isDark));
  }

  setStorageItem(THEME_KEY, theme);
}

function applyMode(mode) {
  const isAnalog = mode === "analog";

  if (analogClock) analogClock.classList.toggle("active", isAnalog);
  if (digitalClock) digitalClock.classList.toggle("active", !isAnalog);

  if (modeToggle) {
    modeToggle.textContent = isAnalog ? "Цифровые" : "Аналоговые";
    modeToggle.setAttribute("aria-pressed", String(isAnalog));
  }

  setStorageItem(MODE_KEY, mode);
}

if (modeToggle) {
  modeToggle.addEventListener("click", () => {
    const currentMode = analogClock?.classList.contains("active") ? "analog" : "digital";
    applyMode(currentMode === "analog" ? "digital" : "analog");
  });
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.body.classList.contains("dark") ? "dark" : "light";
    applyTheme(currentTheme === "dark" ? "light" : "dark");
  });
}

createDialNumbers();
applyTheme(getStorageItem(THEME_KEY) || "light");
applyMode(getStorageItem(MODE_KEY) || "digital");
updateClock();
setInterval(updateClock, 1000);
