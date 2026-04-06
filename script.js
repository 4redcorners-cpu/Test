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

const THEME_KEY = "clock-theme";
const MODE_KEY = "clock-mode";

function pad(number) {
  return String(number).padStart(2, "0");
}

function toRoman(number) {
  const romanMap = [
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
    "XI",
    "XII",
  ];

  return romanMap[number - 1] || String(number);
}

function createDialNumbers() {
  const numbersContainer = document.querySelector(".numbers");
  numbersContainer.innerHTML = "";

  for (let number = 1; number <= 12; number += 1) {
    const mark = document.createElement("span");
    const angle = number * 30;

    mark.textContent = toRoman(number);
    mark.style.setProperty("--angle", `${angle}deg`);
    numbersContainer.appendChild(mark);
  }
}

function updateClock() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  hoursEl.textContent = pad(hours);
  minutesEl.textContent = pad(minutes);
  secondsEl.textContent = pad(seconds);

  const dayText = now.toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  dateLabel.textContent = dayText;

  timezoneLabel.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const hourRotation = (hours % 12) * 30 + minutes * 0.5 + seconds * (0.5 / 60);
  const minuteRotation = minutes * 6 + seconds * 0.1;
  const secondRotation = seconds * 6;

  hourHand.style.transform = `translateX(-50%) rotate(${hourRotation}deg)`;
  minuteHand.style.transform = `translateX(-50%) rotate(${minuteRotation}deg)`;
  secondHand.style.transform = `translateX(-50%) rotate(${secondRotation}deg)`;
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark", isDark);
  themeToggle.textContent = isDark ? "Светлая тема" : "Тёмная тема";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  localStorage.setItem(THEME_KEY, theme);
}

function applyMode(mode) {
  const isAnalog = mode === "analog";
  analogClock.classList.toggle("active", isAnalog);
  digitalClock.classList.toggle("active", !isAnalog);
  modeToggle.textContent = isAnalog ? "Цифровые" : "Аналоговые";
  modeToggle.setAttribute("aria-pressed", String(isAnalog));
  localStorage.setItem(MODE_KEY, mode);
}

modeToggle.addEventListener("click", () => {
  const currentMode = analogClock.classList.contains("active") ? "analog" : "digital";
  applyMode(currentMode === "analog" ? "digital" : "analog");
});

themeToggle.addEventListener("click", () => {
  const currentTheme = document.body.classList.contains("dark") ? "dark" : "light";
  applyTheme(currentTheme === "dark" ? "light" : "dark");
});

createDialNumbers();
applyTheme(localStorage.getItem(THEME_KEY) || "light");
applyMode(localStorage.getItem(MODE_KEY) || "digital");
updateClock();
setInterval(updateClock, 1000);
