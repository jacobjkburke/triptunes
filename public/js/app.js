var form = document.getElementById("login-form");
var startValue = '';  
var destinationValue = '';
var genreValue = '';
var travelMethod = '';
    
// Google Maps API

var client_id = '8edb16d3b1b4478dab963f2908893e47';
var gmapskey = 'AIzaSyD760B3T64Czqn7vtTUcvUunqKlLXs4FNo';
var localredirect = "http://localhost:3000/authorize";
var start = document.getElementById("origin-input");

var destination = document.getElementById("destination-input");

var genre = document.getElementById("genre-input");
var methodRadios = document.getElementsByName("type");
var methodArray = ["WALKING", "BICYCLING", "TRANSIT", "DRIVING"];

form.addEventListener('submit', function(e) {

   e.preventDefault();

   for (var i = 0, length = methodRadios.length; i < length; i++) {
      if (methodRadios[i].checked) {
         travelMethod = methodArray[i];
         console.log(travelMethod);
         break;
      }
   }
   startValue = start.value;
   destinationValue = destination.value;
   genreValue = genre.value;

   localStorage.setItem("start", startValue);
   localStorage.setItem("end", destinationValue);
   localStorage.setItem("genre", genreValue);
   localStorage.setItem("mode", travelMethod);

   fetch('/api/google?origins=' + startValue + "&destinations=" + destinationValue + "&mode=" + travelMethod + '&key=' + gmapskey)
   .then(function (response) {
     return response.json();
   }).then(function (mapsdata) { 
      console.log(mapsdata);
   });    
  
   var spotifyAUTHURL = "https://accounts.spotify.com/authorize/?client_id=" + 
    					      client_id + "&response_type=code&redirect_uri=" + 
    					      encodeURIComponent(localredirect) + 
    					      "&scope=" + encodeURIComponent('user-read-email user-read-private playlist-modify-private playlist-modify-public playlist-read-private playlist-read-collaborative') +
    					      "&state=34fFs29kd09&show_dialog=true";
      window.location.href = spotifyAUTHURL;
   });

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



