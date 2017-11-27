var express = require('express');
var app = express();
var request = require('request');

var PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
    console.log(new Date().getTime(), req.url);

    next();
});




// Google Maps API

var gmapskey = 'AIzaSyD760B3T64Czqn7vtTUcvUunqKlLXs4FNo';
var url = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=Seattle&destinations=San+Francisco&mode=bicycling&language=fr-FR&key=' + gmapskey;


app.get('/api/google', function (req, res) {
    request.get({
        url: url,
        json: true
    }, function (err, response, body) {
        res.json(body);
        
    });
});




// Spotify API

// These are my test client_credentials,
// replace with your own id/secret
var SPOTIFY_ID = '5cb9c36d867a4d479af678d8c130103c';
var SPOTIFY_SECRET = '47bede1c209c4170b08eeb108bfe14c9';


app.get('/api/spotify', function (req, res) {
    var search = req.query.q;

    // Uses client credentials flow
    // See: https://developer.spotify.com/web-api/authorization-guide/#client-credentials-flow
    // POST https://api.spotify.com/v1/users/{user_id}/playlists --> to create a playlist
    // POST https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}/tracks --> to add tracks to the playlist
    request.post({
        url: 'https://accounts.spotify.com/api/token',
        auth: {
            username: SPOTIFY_ID,
            password: SPOTIFY_SECRET,
            sendImmediately: true
        },
        form: {
            grant_type: 'client_credentials'
        },
        json: true
    }, function (authErr, authResponse, authJSON) {
        request.get({
            url: 'https://api.spotify.com/v1/search?type=track&query=' + search,
            auth: {
                bearer: authJSON.access_token
            },
            json: true
        }, function (searchErr, searchResponse, searchBody) {
            res.json(searchBody);
            
        });
    });
});



app.use(express.static('public'));

app.listen(PORT, function () {
    console.log('App listening on port ' + PORT)
});
