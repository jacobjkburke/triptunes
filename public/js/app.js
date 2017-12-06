var form = document.getElementById("spotify-form");
var start = document.getElementById("start");
var end = document.getElementById("destination");
var mode = $('input[name=options]:checked').val();


// Google Maps API

$(document).ready(function() {
  localStorage.clear();
});

var client_id = '8edb16d3b1b4478dab963f2908893e47';
var gmapskey = 'AIzaSyD760B3T64Czqn7vtTUcvUunqKlLXs4FNo';
var localredirect = "http://localhost:3000/authorize";
form.addEventListener('submit', function(e) {
    e.preventDefault();
    if ($("#playlist-name-input").val() == "" || $("#playlist-name-input").val() == null) {
      $("#playlist-name-input").attr("placeholder", "Must enter title!");
    } else {
    var spotifyInput = $("#spotify-input").val();
    console.log(spotifyInput);
    localStorage.setItem("spotify-input", spotifyInput);

    var opt = localStorage.getItem("adv");
    if (opt == "true") {
      var energy = $("#slider-1").val();
      energy = (energy/100).toFixed(1);
      console.log(energy);
      var danceability = $("#slider-2").val();
      danceability = (danceability/100).toFixed(1);
      console.log(danceability);
      var acousticness = $("#slider-3").val();
      acousticness = (acousticness/100).toFixed(1);
      console.log(acousticness);
      var popularity = $("#slider-4").val();
      localStorage.setItem("energy", energy);
      localStorage.setItem("danceability", danceability);
      localStorage.setItem("acousticness", acousticness);
      localStorage.setItem("popularity", popularity);
    }

    var playlistName = $("#playlist-name-input").val();
    localStorage.setItem("playlist-name", playlistName);

    var spotifyAUTHURL = "https://accounts.spotify.com/authorize/?client_id=" + 
    					 client_id + "&response_type=code&redirect_uri=" + 
    					 encodeURIComponent(localredirect) + 
    					 "&scope=" + encodeURIComponent('user-read-email user-read-private playlist-modify-private playlist-modify-public playlist-read-private playlist-read-collaborative') +
    					 "&state=34fFs29kd09";
    					 
	
    window.location.href = spotifyAUTHURL;
    }
});

var start = document.getElementById("origin-input");

var destination = document.getElementById("destination-input");

var genre = document.getElementById("spotify-input");
//auto complete for song genre maybe?
var methodRadios = document.getElementsByName("type");
var methodArray = ["WALKING", "BICYCLING", "TRANSIT", "DRIVING"];
var submitButton = document.getElementById("onto-next");
submitButton.addEventListener("click", submitFunction);


function submitFunction() {
    for (var i = 0, length = methodRadios.length; i < length; i++) {
        if (methodRadios[i].checked) {
            // do whatever you want with the checked radio
            var travelMethod = methodArray[i];
            console.log(travelMethod);
            localStorage.setItem("mode", travelMethod);
            break;
        }
    }
    var startValue = start.value;
    console.log(startValue);
    var destinationValue = destination.value;
    console.log(destinationValue);
    var genreValue = genre.value;
    console.log(genreValue);

    localStorage.setItem("start", start.value);
    localStorage.setItem("end", destination.value);
    localStorage.setItem("spotifyQuery", genreValue);
    
    
}


// -------------------  GOOGLE MAPS API CODE ------------------
// -------------------- A.K.A. MYSTERY CODE -------------------
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
      mapTypeControl: false,
      center: {lat: 47.6553, lng: -122.3035},
      zoom: 14
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

// -------------------  NAVIGATION ------------------
// This begin button takes the user from the home page to the Google Maps page using animations (transition property)
$("#begin").on("click", function() {
  nav("maps");
});

// This onto-next button takes the user from Google Maps page to Spotify page using animations (transition property)
$("#onto-next").on("click", function(e) {
	e.preventDefault();
	//$("#music").show();
	nav("music");
});


// This hides the music page when the page loads, just for smooth UX
$(document).ready(function() {
	//$("#music").hide();
  $("#control-panel").css("margin-left", "-100vw");

  desAnim(1);

});

function desAnim(t) {
  if (t <= 6) {
      setTimeout(function() {
      $("#t" + t).css("opacity", "1");
      }, 1000);
      setTimeout(function() {
        $("#t" + t).css("opacity", "0");
        desAnim(t+1);
      },4000);
  } else {
    desAnim(1);
  }
}


// -------------------  NAVBAR UI ------------------
/*Basically when each of the three buttons is clicked, a few things are happening

	1. The .nav-selected class is being added to the icon that was clicked,
	and removed from the other two.
	2. The selector-ul (the blue underline under each icon) is being moved
	over under the icon that was pressed
	3. The page animations are being triggered
	4. The .onmusic class is being added/removed depending on if the music
	icon is clicked. This class just makes the icons white instead of black.

*/

$("#nav-home").on("click", function () {
	nav("home");
});

$("#nav-maps").on("click", function () {
  nav("maps");
});

$("#nav-music").on("click", function () {
  nav("music");
});

function nav(location) {
	if (location == "home") {
    $("#music").css("z-index", "-10");
    $("#begin").show();
    $(".header").css("top", "0");
    $("#logo").addClass("logo-active");
		$("#nav-home").addClass("nav-selected");
		$("#nav-maps").removeClass("nav-selected").addClass("onmusic");
    $("#nav-music").removeClass("nav-selected");
    $("#nav-music").addClass("onmusic");
    $("#nav-maps").addClass("onmusic");
		$("#selector-ul").css({
			"left": "33px"
		});
		$("#map").css({
			"margin-left": "0"
		});
		$("#control-panel").css("margin-left", "-100vw");
    $("#welcome").css("margin-left", "0");
    setTimeout(function(){$("#begin").css("opacity","1")},100);
	} else if (location == "maps") {
    $("#begin").css("opacity","0");
    setTimeout(function(){$("#begin").hide();},500);
    $('#origin-input').focus();
    $("#music").css("z-index", "-10");
    $(".header").css("top", "-80px");
    $("#logo").removeClass("logo-active");
		$("#nav-maps").addClass("nav-selected");
		$("#nav-home").removeClass("nav-selected");
		$("#nav-music").removeClass("nav-selected");
		$("#selector-ul").css({
			"left": "98px"
		});
		$("#welcome").css("margin-left", "-100vw");
		$("#map").css({
			"margin-left": "0"
		});
		$("div.navitem").removeClass("onmusic");
		$("#control-panel").css("margin-left", "0");
	} else if (location == "music") {
    $("#begin").css("opacity","0");
    setTimeout(function(){$("#begin").hide();},500);
    $('#spotify-input').focus();
    $("#nav-music").addClass("nav-selected");
    $(".header").css("top", "-80px");
    $("#logo").removeClass("logo-active");
		$("#nav-home").removeClass("nav-selected");
		$("#nav-maps").removeClass("nav-selected");
		$("#selector-ul").css({
			"left": "164px"
		});
		$("#welcome").css("margin-left", "-100vw");
		$("#map").css({
			"margin-left": "-100vw"
		});
		$("#control-panel").css("margin-left", "-100vw");
		$("div.navitem").addClass("onmusic");
		setTimeout(function() {
			$("#music").css("z-index", "10");
		}, 1000);
	}
}

$("#spotify-next").on("click", function(e) {
  e.preventDefault();
  $("#playlist-name").css({
    "display": "block"
  });
  setTimeout(function() {
    $("#playlist-name").css({
      "opacity": "1"
    }); 
  }, 100);
});

$("#playlist-name-close").on("click", function(e) {
  e.preventDefault();
  $("#playlist-name").css({
    "opacity": "0"
  }); 
  setTimeout(function() {
    $("#playlist-name").css({
      "display": "none"
    });
  }, 200);
});

var options = false;
$("#more-options-btn").on("click", function() {
    if (!options) {
      $("#music").css("padding-top", "5vh");
      $("#more-options").css("display", "block");
      setTimeout(function() {
        $("#more-options").css({
          "height": "300px"
        });
      }, 0.000000001);
      localStorage.setItem("adv", "true");
      $("#more-options-btn").text("Hide Options");
      $("#more-options-btn").css("color", "gray");
      options = true;
    } else {
      $("#music").css("padding-top", "25vh");
      $("#more-options").css("height", "0");
      setTimeout(function() {
        $("#more-options").css({
          "display": "none"
        });
      }, 150);
      localStorage.setItem("adv", "false");
      $("#more-options-btn").text("More Options");
      $("#more-options-btn").css("color", "rgb(55, 167, 55)");
      options = false;
    }
});