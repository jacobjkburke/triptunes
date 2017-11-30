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
var url = 'https://maps.googleapis.com/maps/api/distancematrix/json?';
// var url = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=" + start.value + "&destinations=" + end.value + "&mode=" + mode + "&language=fr-FR&key=' + gmapskey;

app.get('/api/google', function (req, res) {
    request.get({
        url: url,
        json: true
    }, function (err, response, body) {
        res.json(body);
        
    });
});



// Spotify API

var SPOTIFY_ID = '5cb9c36d867a4d479af678d8c130103c';
var SPOTIFY_SECRET = '47bede1c209c4170b08eeb108bfe14c9';



// STEP 1: LOGIN AUTHORIZATION

// code here



// STEP 2: GET USER INFO
// get user info --> user_id
app.get('/api/userinfo/', function (req, res) {

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
            url: 'https://api.spotify.com/v1/me',
            auth: {
                bearer: authJSON.access_token
            },
            json: true
        }, function (searchErr, searchResponse, searchBody) {
            res.json(searchBody);
            
        });
    });
});




// STEP 3: CREATE PLAYLIST
// POST https://api.spotify.com/v1/users/{user_id}/playlists --> to create a playlist
// get playlist_id and user_id 
app.get('/api/create-playlist/', function (req, res) {
    var search = req.query.q;

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
        request.post({
            url: 'https://api.spotify.com/v1/users/' + search + '/playlists',
            auth: {
                bearer: authJSON.access_token
            },
            json: true
        }, function (searchErr, searchResponse, searchBody) {
            res.json(searchBody);
            
        });
    });
});



// STEP 4: SEARCH FOR SONGS
app.get('/api/spotify', function (req, res) {
    var search = req.query.q;

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



// STEP 5: ADD SONGS TO PLAYLIST
// POST https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}/tracks --> to add tracks to the playlist
app.get('/api/add-songs/', function (req, res) {
    var search = req.query.q;

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
        request.post({
            url: 'https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}/tracks' + search,
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
