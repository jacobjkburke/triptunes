
window.addEventListener('load', function (e) {
	setTimeout(function() {

	
	var spotifyInput = localStorage.getItem("spotify-input");
	var duration = localStorage.getItem("duration");
	var playlistName = localStorage.getItem("playlist-name");
	console.log("duration: " + duration);

    e.preventDefault();

	console.log(spotifyInput);

	var query = spotifyInput;
	
	console.log(query);

	var token = window.location.search.split("?")[1].split("=")[1];

	console.log(token);
	
    var user_id = '';

	var playlist_id = '';
	
	console.log(playlistName);
    
	fetch('/api/userinfo?access_token=' + token)
  	.then(function (response) {
        return response.json();
  	}).then(function (userinfo) {	  	
  	  	user_id = userinfo.id;
  	  	console.log(user_id);
  	  	console.log(userinfo);
      	return fetch('/api/create-playlist?access_token=' + token + "&id=" + user_id + "&name=" + playlistName)
      	.then(function(response) {     		
      		return response.json();
      	}).then(function(createdplaylist) {
      		// console.log(createdplaylist);
      		playlist_id = JSON.parse(createdplaylist).id;
      		return fetch('/api/spotify?q=' + query + '&access_token=' + token)
      		.then(function(response) {	
      			return response.json();    
			}).then(function(search) {
			console.log(search);
            var dict = search.tracks.items;
            var totaltime = 0;
            var songs = [];
            for (var i = 0; i < dict.length; i++) {
               if (totaltime < duration) {   
                  totaltime += dict[i].duration_ms / 1000
                  songs.push(dict[i].uri);
               }
            }
				return fetch('./api/addsongs?uris=' + songs + '&id=' + user_id + "&playlistid=" + playlist_id + '&access_token=' + token)
				.then(function(response) {
					return response.json();
				}).then(function(addedsongs) {
					// console.log(addedsongs);
               return fetch('./api/getplaylist?id=' + user_id + "&playlistid=" + playlist_id + "&access_token=" + token)
               .then(function(response) {
                  return response.json();
               }).then(function(retrievedplaylist) {
                	//console.log(JSON.parse(retrievedplaylist));
                  localStorage.setItem("uritouse", JSON.parse(retrievedplaylist).uri);
               });
				});
			});
		});
	  });
	}, 2500);
});
