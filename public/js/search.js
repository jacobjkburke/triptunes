var spotifyForm = document.getElementById("spotify-form");
var spotifyInput = document.getElementById("spotify-input");

spotifyForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var query = encodeURIComponent(spotifyInput.value);

    var token = window.location.search.split("?")[1].split("=")[1];


// we will work on nesting the code below during lab tomorrow
    
//   fetch('/api/userinfo?access_token=' + token)
//   .then(function (response) {
//       return response.json();
//   }).then(function (userinfo) {
//       return fetch('/api/create-playlist?access_token=' + token)
//       .then(function(response) {
//       	return response.json();
//       }).then(function(createdplaylist) {
//       	return fetch('/api/spotify?q=' + query + '&access_token=' + token)
//       	.then(function(response) {
//       		return response.json();
//       	}).then(function(songResults) {
//       		return fetch('https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}/tracks?access_token' + token)
//       		.then(function(response) {
//       			return response.json();
//       		});
//   		});
//		 });
//    });

	fetch('/api/spotify?q=' + query + '&access_token=' + token)
	.then(function (response) {
		return response.json();
	}).then(function (json) {
	    console.log(json);
	});
});
