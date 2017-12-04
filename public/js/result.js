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

var gmapskey = 'AIzaSyD760B3T64Czqn7vtTUcvUunqKlLXs4FNo';
var start = localStorage.getItem("start");
var end = localStorage.getItem("end");
var genre = localStorage.getItem("genre");
var mode = localStorage.getItem("mode");
var language = 'fr-FR';
console.log(start);
console.log(end);
console.log(genre);
console.log(mode);

fetch('/api/google?origins=' + start + "&destinations=" + end + "&mode=" + mode + '&language=' + language + '&key=' + gmapskey)
.then(function (response) {
    return response.json();
}).then(function (mapsdata) { 
  console.log(mapsdata);
  localStorage.setItem("duration", mapsdata.rows[0].elements[0].duration.value);
});   

var playlist = document.getElementById("playlist");
var uri = localStorage.getItem("uritouse");
var songs = document.createElement("iframe"); 
songs.src = 'https://open.spotify.com/embed?uri=' + uri;
console.log(songs.src);
songs.width = '300';
songs.height = '300';
songs.frameborder = '0';
songs.allowtransparency = 'true';
playlist.appendChild(songs);
