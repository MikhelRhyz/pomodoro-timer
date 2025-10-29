const testSoundBtn = document.querySelector("#testSoundBtn");

testSoundBtn.addEventListener("click", () => {
    const soundSelect = document.querySelector("#soundSelect").value;
    let audioElement;

    if (soundSelect === "default") {
        audioElement = document.querySelector("#audioDefault");
    } else if (soundSelect.value === "beep") {
        audioElement = document.querySelector("#audioBeep");
    }

    if (audioElement) audioElement.play();
});