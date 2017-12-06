// document.getElementById("play").addEventListener("click", playFunction);
// document.getElementById("stop").addEventListener("click", stopFunction);
 document.getElementById("restart").addEventListener("click", homeFunction);
 document.getElementById("title").addEventListener("click", homeFunction);
 document.getElementById("logo").addEventListener("click", homeFunction);

$(document).on("load", function() {
    location.reload();
    loadingAnim(); 
});

var loading = true;

function loadingAnim() {
    if (loading) {
        $("#loading-p").text("Loading");
        setTimeout(function(){$("#loading-p").text("Loading.");},500);
        setTimeout(function(){$("#loading-p").text("Loading..");},1000);
        setTimeout(function(){$("#loading-p").text("Loading...");},1500);
        loadingAnim();
    }
}


function homeFunction() {
    window.location.href = 'index.html';
}

var gmapskey = 'AIzaSyD760B3T64Czqn7vtTUcvUunqKlLXs4FNo';
var start = localStorage.getItem("start");
var end = localStorage.getItem("end");
var mode = localStorage.getItem("mode");
var language = 'fr-FR';
console.log(start);
console.log(end);
console.log(mode);

fetch('/api/google?origins=' + start + "&destinations=" + end + "&mode=" + mode + '&language=' + language + '&key=' + gmapskey)
.then(function (response) {
    return response.json();
}).then(function (mapsdata) { 
  console.log(mapsdata);
  localStorage.setItem("duration", mapsdata.rows[0].elements[0].duration.value);
});   

setTimeout(function() {
    var playlist = document.getElementById("playlist");
    var uri = localStorage.getItem("uritouse");
    var songs = document.createElement("iframe"); 
    songs.src = 'https://open.spotify.com/embed?uri=' + uri;
    console.log(songs.src);
    var w = window.innerWidth;
    var h = window.innerHeight;
    var wi = parseInt(w);
    var he = parseInt(h);
    var wid =  he/2;
    var hei =  he/2;
    songs.width = wid + "px";
    songs.height = hei + "px";
    songs.frameborder = '0';
    songs.allowtransparency = 'true';
    playlist.appendChild(songs);
    $("#page-elements").removeClass("hidden").addClass("show");
    $("#loading").removeClass("show").addClass("hidden");
    loading = false;
}, 8000);

