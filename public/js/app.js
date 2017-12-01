var form = document.getElementById("login-form");
var start = document.getElementById("start");
var end = document.getElementById("destination");
var mode = $('input[name=options]:checked').val();


// Google Maps API
// TO-DO: STORE THE DURATION IN LOCAL STORAGE SO WE CAN USE IT LATER

var client_id = '5cb9c36d867a4d479af678d8c130103c';
var gmapskey = 'AIzaSyD760B3T64Czqn7vtTUcvUunqKlLXs4FNo';
var localredirect = "http://localhost:3000/authorize";
form.addEventListener('submit', function(e) {

    e.preventDefault();

    var spotifyAUTHURL = "https://accounts.spotify.com/authorize/?client_id=" + 
    					 client_id + "&response_type=code&redirect_uri=" + 
    					 encodeURIComponent(localredirect) + 
    					 "&scope=user-read-private%20user-read-email&state=34fFs29kd09&show_dialog=true";
	
    window.location.href = spotifyAUTHURL;
});




