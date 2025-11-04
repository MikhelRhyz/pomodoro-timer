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

export function startTimer(timer, seconds, session) {
  const soundSelect = document.querySelector("#soundSelect");
  let audioElement;
  cycles = cyclesBeforeLong.value;
  let originalCycle = cycles;

  if (session.status === "active") {
    sessionCount.textContent = `${round - 1} / ${cycles} completed`;
  }

  if (soundSelect.value === "default") {
    audioElement = document.querySelector("#audioDefault");
  } else if (soundSelect.value === "beep") {
    audioElement = document.querySelector("#audioBeep");
  } else if (soundSelect.value === "none") {
    audioElement = null; // explicitly no sound
  }

  timer = setInterval(() => {
    if (seconds < 0) {
      if (session.status === "active" && round < cycles) {
        clearInterval(timer);
        if (audioElement) audioElement.play();
        progressBar.style.width = `${(round / originalCycle) * 100}%`;
        sessionCount.textContent = `${round} / ${originalCycle} completed`;
        setSessionStatus("short-break");
        notifyUser("Time for a short break!");
        changeTimeDisplay();
        if (autoStartNext.checked) {
          startCountDown();
        }
        return;
      } else if (session.status === "short-break") {
        clearInterval(timer);
        round++;
        if (audioElement) audioElement.play();
        setSessionStatus("inactive");
        notifyUser("Break over! Time to get back to work.");
        changeTimeDisplay();
        if (autoStartNext.checked) {
          startCountDown();
        }
        return;
      } else if (session.status === "active" && round === cycles) {
        clearInterval(timer);
        if (audioElement) audioElement.play();
        progressBar.style.width = `${(round / originalCycle) * 100}%`;
        sessionCount.textContent = `${round} / ${originalCycle} completed`;
        setSessionStatus("long-break");
        notifyUser("Time for a long break!");
        changeTimeDisplay();
        if (autoStartNext.checked) {
          startCountDown();
        }
        return;
      } else if (session.status === "long-break") {
        clearInterval(timer);
        round = 1;
        if (audioElement) audioElement.play();
        progressBar.style.width = "0%";
        sessionCount.textContent = `${round - 1} / ${originalCycle} completed`;
        setSessionStatus("inactive");
        notifyUser("Long break over! Time to get back to work.");
        cyclesBeforeLong.disabled = false;
        autoStartNext.disabled = false;
        changeTimeDisplay();
        return;
      }
    }

    const min = String(Math.floor(seconds / 60));
    const sec = String(seconds % 60);
    seconds--;
    timeRemaining.textContent = `${min.padStart(2, "0")}:${sec.padStart(
      2,
      "0"
    )}`;
    console.log(round);
  }, 1000);

  return { timer };
}

function changeTimeDisplay() {
  if (session.status === "short-break") {
    const breakTime = Number(shortBreakInput.value);
    const sec = breakTime * 60;
    const minRem = String(Math.floor(sec / 60)).padStart(2, "0");
    const secRem = String(sec % 60).padStart(2, "0");
    timeRemaining.textContent = `${minRem}:${secRem}`;
  } else if (session.status === "inactive") {
    const activeTime = Number(workInput.value);
    const sec = activeTime * 60;
    const minRem = String(Math.floor(sec / 60)).padStart(2, "0");
    const secRem = String(sec % 60).padStart(2, "0");
    timeRemaining.textContent = `${minRem}:${secRem}`;
  } else if (session.status === "long-break") {
    const breakTime = Number(longBreakInput.value);
    const sec = breakTime * 60;
    const minRem = String(Math.floor(sec / 60)).padStart(2, "0");
    const secRem = String(sec % 60).padStart(2, "0");
    timeRemaining.textContent = `${minRem}:${secRem}`;
  }
}

function notifyUser(text) {
  if (notifyDesktop.checked && Notification.permission === "granted") {
    new Notification("Pomodoro Timer", {
      body: text,
    });
  }
}

export function resetRounds() {
  round = 1;
}