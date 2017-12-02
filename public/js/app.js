var form = document.getElementById("login-form");
var start = document.getElementById("start");
var end = document.getElementById("destination");
var mode = $('input[name=options]:checked').val();


// Google Maps API
// TO-DO: STORE THE DURATION IN LOCAL STORAGE SO WE CAN USE IT LATER

var client_id = '8edb16d3b1b4478dab963f2908893e47';
var gmapskey = 'AIzaSyD760B3T64Czqn7vtTUcvUunqKlLXs4FNo';
var localredirect = "http://localhost:3000/authorize";
form.addEventListener('submit', function(e) {

    e.preventDefault();

    var spotifyAUTHURL = "https://accounts.spotify.com/authorize/?client_id=" + 
    					 client_id + "&response_type=code&redirect_uri=" + 
    					 encodeURIComponent(localredirect) + 
    					 "&scope=" + encodeURIComponent('user-read-email user-read-private playlist-modify-private playlist-modify-public playlist-read-private playlist-read-collaborative') +
    					 "&state=34fFs29kd09&show_dialog=true";
    					 
	
    window.location.href = spotifyAUTHURL;
});


var start = document.getElementById("origin-input");

var destination = document.getElementById("destination-input");

var genre = document.getElementById("genre-input");
//auto complete for song genre maybe?
var methodRadios = document.getElementsByName("type");
var methodArray = ["WALKING", "BICYCLING", "TRANSIT", "DRIVING"];
var submitButton = document.getElementById("submit");
submitButton.addEventListener("click", submitFunction);


function submitFunction() {
    for (var i = 0, length = methodRadios.length; i < length; i++) {
        if (methodRadios[i].checked) {
            // do whatever you want with the checked radio
            var travelMethod = methodArray[i];
            console.log(travelMethod);
            break;
        }
    }
    var startValue = start.value;
    console.log(startValue);
    var destinationValue = destination.value;
    console.log(destinationValue);
    var genreValue = genre.value;
    console.log(genreValue);
}

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
      mapTypeControl: false,
      center: {lat: 47.6553, lng: 122.3035},
      zoom: 13
    });

    new AutocompleteDirectionsHandler(map);
  }
  
  function AutocompleteDirectionsHandler(map) {
    this.map = map;
    this.originPlaceId = null;
    this.destinationPlaceId = null;
    this.travelMode = 'WALKING';
    var originInput = document.getElementById('origin-input');
    var destinationInput = document.getElementById('destination-input');
    var modeSelector = document.getElementById('mode-selector');
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    this.directionsDisplay.setMap(map);

    var originAutocomplete = new google.maps.places.Autocomplete(
        originInput, {placeIdOnly: true});
    var destinationAutocomplete = new google.maps.places.Autocomplete(
        destinationInput, {placeIdOnly: true});

    this.setupClickListener('changemode-walking', 'WALKING');
    this.setupClickListener('changemode-bicycling', 'BICYCLING');
    this.setupClickListener('changemode-transit', 'TRANSIT');
    this.setupClickListener('changemode-driving', 'DRIVING');

    this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
    this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(destinationInput);
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
  }

  // Sets a listener on a radio button to change the filter type on Places
  // Autocomplete.
  AutocompleteDirectionsHandler.prototype.setupClickListener = function(id, mode) {
    var radioButton = document.getElementById(id);
    var me = this;
    radioButton.addEventListener('click', function() {
      me.travelMode = mode;
      me.route();
    });
  };

  AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
    var me = this;
    autocomplete.bindTo('bounds', this.map);
    autocomplete.addListener('place_changed', function() {
      var place = autocomplete.getPlace();
      if (!place.place_id) {
        window.alert("Please select an option from the dropdown list.");
        return;
      }
      if (mode === 'ORIG') {
        me.originPlaceId = place.place_id;
      } else {
        me.destinationPlaceId = place.place_id;
      }
      me.route();
    });

  };

  AutocompleteDirectionsHandler.prototype.route = function() {
    if (!this.originPlaceId || !this.destinationPlaceId) {
      return;
    }
    var me = this;

    this.directionsService.route({
      origin: {'placeId': this.originPlaceId},
      destination: {'placeId': this.destinationPlaceId},
      travelMode: this.travelMode
    }, function(response, status) {
      if (status === 'OK') {
        me.directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  };



