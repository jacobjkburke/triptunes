var form = document.getElementById("login-form");
var start = document.getElementById("start");
var end = document.getElementById("destination");
var mode = $('input[name=options]:checked').val();

// Google Maps API

var gmapskey = 'AIzaSyD760B3T64Czqn7vtTUcvUunqKlLXs4FNo';
var query = "";
form.addEventListener('submit', function(e) {
    e.preventDefault();

    query = "origins=" + start.value + "&destinations=" + end.value + "&mode=" + mode + "&language=fr-FR&key=" + gmapskey;

    fetch('/api/google?q=' + query)
    .then(function (response) {
        return response.json();
    }).then(function (json) {
        console.log(json);
    }).then(function() {
    	window.location.href = 'search.html';
    });
});

console.log(query);






