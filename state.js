import { startTimer } from "./startTimer.js";

export let session = { status: "inactive" };
export let timer = { status: undefined };
export let paused = { status: false };

const workInput = document.querySelector("#workInput");
const shortBreakInput = document.querySelector("#shortBreakInput");
const longBreakInput = document.querySelector("#longBreakInput");
let seconds = 0;
const autoStartEl = document.querySelector("#autoStartNext");

export function setSessionStatus(val) {
  session.status = val;
  console.log(session.status);
}

export function startCountDown() {
  if (session.status === "inactive") {
    clearInterval(timer);
    setSessionStatus("active");
    const workInputValue = Number(workInput.value);
    seconds = workInputValue * 60;
    timer = startTimer(timer, seconds, session).timer;
    paused.status = false;
    cyclesBeforeLong.disabled = true;
    autoStartEl.disabled = true;
  } else if (session.status === "short-break") {
    clearInterval(timer);
    const breakInputValue = Number(shortBreakInput.value);
    seconds = breakInputValue * 60;
    timer = startTimer(timer, seconds, session).timer;
    paused.status = false;
    cyclesBeforeLong.disabled = true;
  } else if (session.status === "long-break") {
    clearInterval(timer);
    const breakInputValue = Number(longBreakInput.value);
    seconds = breakInputValue * 60;
    timer = startTimer(timer, seconds, session).timer;
    paused.status = false;
    cyclesBeforeLong.disabled = true;
  }
}

export function setTimer(val) {
  timer.status = val;
}

export function setPaused(val) {
  paused.status = val;
}
