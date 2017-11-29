// var twitterForm = document.getElementById("twitter-form");
// var twitterInput = document.getElementById("twitter-input");

// twitterForm.addEventListener('submit', function (e) {
//     e.preventDefault();

//     var query = encodeURIComponent(twitterInput.value);

//     fetch('/api/twitter?q=' + query)
//     .then(function (response) {
//         return response.json();
//     }).then(function (json) {
//         console.log(json);
//     });
// });

// var spotifyForm = document.getElementById("spotify-form");
// var spotifyInput = document.getElementById("spotify-input");

// spotifyForm.addEventListener('submit', function (e) {
//     e.preventDefault();

//     var query = encodeURIComponent(spotifyInput.value);

//     fetch('/api/spotify?q=' + query)
//     .then(function (response) {
//         return response.json();
//     }).then(function (json) {
//         console.log(json);
//     });
// });


var form = document.getElementById("login-form");
var start = document.getElementById("start");
var end = document.getElementById("destination");
var mode = "";

if (document.getElementById('option-1').checked) {
  mode = document.getElementById('option-1').value;
} else if (document.getElementById('option-2').checked) {
  mode = document.getElementById('option-2').value;
} else {
  mode = document.getElementById('option-3').value;
}

// Google Maps API

var gmapskey = 'AIzaSyD760B3T64Czqn7vtTUcvUunqKlLXs4FNo';

form.addEventListener('submit', function(e) {
    e.preventDefault();

    var query = "origins=" + start.value + "&destinations=" + end.value + "&mode=" + mode + "&language=fr-FR&key=" + gmapskey;

    fetch('/api/google?q=' + query)
    .then(function (response) {
        return response.json();
    }).then(function (json) {
        console.log(json);
    });
});







