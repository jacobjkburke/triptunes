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

var SPOTIFY_ID = '8edb16d3b1b4478dab963f2908893e47';
var SPOTIFY_SECRET = '1f7b56e0791748c689742b52e49116af';


// STEP 1: LOGIN AUTHORIZATION

app.get('/authorize', function (req, res) {
    var code = req.query.code;
    var state = req.query.state;
    request.post({
        url: 'https://accounts.spotify.com/api/token',
        auth: {
            username: SPOTIFY_ID,
            password: SPOTIFY_SECRET,
            sendImmediately: true
        },
        form: {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: 'http://localhost:3000/authorize'
        },
        json: true
    }, function (authErr, authResponse, authJSON) {
        res.redirect("/result.html?token=" + authJSON.access_token);
    });
});


// STEP 2: GET USER INFO
// get user info --> user_id
app.get('/api/userinfo', function (req, res) {
    var token = req.query.access_token;
    request.get({
        url: 'https://api.spotify.com/v1/me',
        auth: {
            bearer: token
        },
        json: true
    }, function (searchErr, searchResponse, searchBody) {
        res.json(searchBody);       
    });
});


// STEP 3: CREATE PLAYLIST
// POST https://api.spotify.com/v1/users/{user_id}/playlists --> to create a playlist
// get playlist_id and user_id 
app.get('/api/create-playlist', function (req, res) {
    var token = req.query.access_token;
    var id = req.query.id;
    request.post({
        url: 'https://api.spotify.com/v1/users/' + id + '/playlists',
        body: JSON.stringify({
            'name': "info343",
            'public': false
        }),
        dataType:'json',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        }
    }, function (searchErr, searchResponse, searchBody) {
        res.json(searchBody);       
    });

});



// STEP 4: SEARCH FOR SONGS
app.get('/api/spotify', function (req, res) {
    var search = req.query.q;  
    var token = req.query.access_token;
    request.get({
        url: 'https://api.spotify.com/v1/search?type=track&query=' + search,
        auth: {
            bearer: token
        },
        json: true
    }, function (searchErr, searchResponse, searchBody) {
        res.json(searchBody);   
    });
});



// STEP 5: ADD SONGS TO PLAYLIST
// POST https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}/tracks --> to add tracks to the playlist
app.get('/api/addsongs', function (req, res) {
    var token = req.query.access_token; 
    var playlistid = req.query.playlistid;
    var userid = req.query.id;
    var uris = req.query.uris;
    request.post({
        url: 'https://api.spotify.com/v1/users/' + userid + '/playlists/' + playlistid + '/tracks',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',  
        },
        body: JSON.stringify({
            'uris': [uris]
        }),
        dataType:'json'
    }, function (searchErr, searchResponse, searchBody) {
        res.json(searchBody); 
    });
});



app.use(express.static('public'));
app.listen(PORT, function () {
    console.log('App listening on port ' + PORT)
});
