var spotifyForm = document.getElementById("spotify-form");
var spotifyInput = document.getElementById("spotify-input");

spotifyForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var query = encodeURIComponent(spotifyInput.value);

    fetch('/api/userinfo?q=')
    .then(function (response) {
        return response.json();
    }).then(function (userinfo) {
        return fetch('/api/create-playlist?q=' + userInfo.id)
        .then(function(response) {
        	return response.json();
        }).then(function(createdplaylist) {
        	return fetch('/api/spotify?q=' + query)
        	.then(function(response) {
        		return response.json();
        	}).then(function(songResults) {
        		return fetch('/api/add-songs?q=' + (NEED PLAYLISTID AND USERID FROM "createdplaylist" JSON OBJECT ABOVE))
        		.then(function(response) {
        			return response.json();
        		});
    		});
		});
    });
});
