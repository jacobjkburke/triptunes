document.getElementById("play").addEventListener("click", playFunction);
document.getElementById("stop").addEventListener("click", stopFunction);
document.getElementById("home").addEventListener("click", homeFunction);

function playFunction() {
    var playButton = document.getElementById("play");
    var stopButton = document.getElementById("stop");
    playButton.classList.add("hidden");
    stopButton.classList.remove("hidden");
}

function stopFunction() {
    var playButton = document.getElementById("play");
    var stopButton = document.getElementById("stop");
    stopButton.classList.add("hidden");
    playButton.classList.remove("hidden");
}
function homeFunction() {
    window.location.href = 'index.html';
}
