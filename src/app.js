var start = document.getElementById("start");
var autocompleteStart = new google.maps.places.Autocomplete(start);
var destination = document.getElementById("destination");
var autocompleteStart = new google.maps.places.Autocomplete(destination);
var genre = document.getElementById("genre");
//auto complete for song genre maybe?
var methodRadios = document.getElementsByName("options");
var methodArray = ["driving", "walking", "bicycling"];
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

