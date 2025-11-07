import { setSessionStatus, session, startCountDown } from "./state.js";

const timeRemaining = document.querySelector("#timeRemaining");
const cyclesBeforeLong = document.querySelector("#cyclesBeforeLong");
const progressBar = document.querySelector("#progressBar");
let round = 1;
let cycles = 0;
const shortBreakInput = document.querySelector("#shortBreakInput");
const workInput = document.querySelector("#workInput");
const longBreakInput = document.querySelector("#longBreakInput");
let sessionCount = document.querySelector("#sessionCount");
const autoStartNext = document.querySelector("#autoStartNext");
const notifyDesktop = document.querySelector("#notifyDesktop");
const sessionType = document.querySelector("#sessionType");

export function startTimer(timer, durationSeconds, session) {
  const soundSelect = document.querySelector("#soundSelect");
  let audioElement;

  cycles = Number(cyclesBeforeLong.value);
  let originalCycle = cycles;

  if (session.status === "active") {
    sessionCount.textContent = `${round - 1} / ${cycles} completed`;
  }

  if (soundSelect.value === "default") {
    audioElement = document.querySelector("#audioDefault");
  } else if (soundSelect.value === "beep") {
    audioElement = document.querySelector("#audioBeep");
  } else if (soundSelect.value === "none") {
    audioElement = null;
  }

  // Timestamp-based approach
  const startTime = Date.now();
  let endTime = startTime + durationSeconds * 1000;

  timer = setInterval(() => {
    const now = Date.now();
    let remainingMs = endTime - now;

    if (remainingMs <= 0) {
      clearInterval(timer);

      // Play sound
      if (audioElement) audioElement.play();

      // Handle session transitions
      if (session.status === "active" && round < cycles) {
        progressBar.style.width = `${(round / originalCycle) * 100}%`;
        sessionCount.textContent = `${round} / ${originalCycle} completed`;
        setSessionStatus("short-break");
        notifyUser("Time for a short break!");
        changeTimeDisplay();
        if (autoStartNext.checked) startCountDown();
        sessionType.textContent = "Short Break";
        return;
      } else if (session.status === "short-break") {
        round++;
        setSessionStatus("inactive");
        notifyUser("Break over! Time to get back to work.");
        changeTimeDisplay();
        if (autoStartNext.checked) startCountDown();
        sessionType.textContent = "Work";
        return;
      } else if (session.status === "active" && round === cycles) {
        progressBar.style.width = `${(round / originalCycle) * 100}%`;
        sessionCount.textContent = `${round} / ${originalCycle} completed`;
        setSessionStatus("long-break");
        notifyUser("Time for a long break!");
        changeTimeDisplay();
        sessionType.textContent = "Long Break";
        if (autoStartNext.checked) startCountDown();
        return;
      } else if (session.status === "long-break") {
        round = 1;
        progressBar.style.width = "0%";
        sessionCount.textContent = `${round - 1} / ${originalCycle} completed`;
        setSessionStatus("inactive");
        notifyUser("Long break over! Time to get back to work.");
        sessionType.textContent = "Work";
        cyclesBeforeLong.disabled = false;
        autoStartNext.disabled = false;
        changeTimeDisplay();
        return;
      }
    }

    // Update remaining time
    const remainingSec = Math.ceil(remainingMs / 1000);
    const min = String(Math.floor(remainingSec / 60)).padStart(2, "0");
    const sec = String(remainingSec % 60).padStart(2, "0");
    timeRemaining.textContent = `${min}:${sec}`;
  }, 500); // shorter interval for better accuracy

  return { timer, endTime };
}

function changeTimeDisplay() {
  if (session.status === "short-break") {
    const sec = Number(shortBreakInput.value) * 60;
    const minRem = String(Math.floor(sec / 60)).padStart(2, "0");
    const secRem = String(sec % 60).padStart(2, "0");
    timeRemaining.textContent = `${minRem}:${secRem}`;
  } else if (session.status === "inactive") {
    const sec = Number(workInput.value) * 60;
    const minRem = String(Math.floor(sec / 60)).padStart(2, "0");
    const secRem = String(sec % 60).padStart(2, "0");
    timeRemaining.textContent = `${minRem}:${secRem}`;
  } else if (session.status === "long-break") {
    const sec = Number(longBreakInput.value) * 60;
    const minRem = String(Math.floor(sec / 60)).padStart(2, "0");
    const secRem = String(sec % 60).padStart(2, "0");
    timeRemaining.textContent = `${minRem}:${secRem}`;
  }
}

function notifyUser(text) {
  if (notifyDesktop.checked && Notification.permission === "granted") {
    new Notification("Pomodoro Timer", { body: text });
  }
}

export function resetRounds() {
  round = 1;
}
