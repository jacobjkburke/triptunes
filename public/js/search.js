var spotifyForm = document.getElementById("spotify-form");
var spotifyInput = document.getElementById("spotify-input");

spotifyForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var query = encodeURIComponent(spotifyInput.value);

    var token = window.location.search.split("?")[1].split("=")[1];

    var user_id = '';

    var playlist_id = '';
    
	fetch('/api/userinfo?access_token=' + token)
  	.then(function (response) {
  		console.log("step1");
        return response.json();
  	}).then(function (userinfo) {	  	
  	  	user_id = userinfo.id;
  	  	console.log(user_id);
  	  	console.log(userinfo);
      	return fetch('/api/create-playlist?access_token=' + token + "&id=" + user_id)
      	.then(function(response) {     		
      		return response.json();
      	}).then(function(createdplaylist) {
      		console.log(createdplaylist);
      		playlist_id = JSON.parse(createdplaylist).id;
      		return fetch('/api/spotify?q=' + query + '&access_token=' + token)
      		.then(function(response) {	
      			return response.json();    
			}).then(function(search) {
				console.log(search);
				return fetch('./api/addsongs?uris=spotify:track:69M9QCMsCQ5MLsw7BBW0rL' + '&id=' + user_id + "&playlistid=" + playlist_id + '&access_token=' + token)
				.then(function(response) {
					return response.json();
				}).then(function(addedsongs) {
					console.log(addedsongs);
				});
			});
		});
  	});
});

