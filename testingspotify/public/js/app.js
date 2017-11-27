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

var spotifyForm = document.getElementById("spotify-form");
var spotifyInput = document.getElementById("spotify-input");

spotifyForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var query = encodeURIComponent(spotifyInput.value);

    fetch('/api/spotify?q=' + query)
    .then(function (response) {
        return response.json();
    }).then(function (json) {
        console.log(json);
    });
});