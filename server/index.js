var express = require('express');
var app = express();
var request = require('request');

var PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
    console.log(new Date().getTime(), req.url);
    next();
});



// GOOGLE MAPS API

var gmapskey = 'AIzaSyD760B3T64Czqn7vtTUcvUunqKlLXs4FNo';
var url = 'https://maps.googleapis.com/maps/api/distancematrix/json?';
app.get('/api/google', function (req, res) {
    var start = req.query.origins;
    var end = req.query.destinations;
    var mode = req.query.mode;
    var key = req.query.key;
    request.get({
        url: url + "origins=" + start + "&destinations=" + end + "&mode=" + mode + "&key=" + gmapskey,
        json: true
    }, function (err, response, body) {
        res.json(body);  
    });
});



// SPOTIFY API

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
app.get('/api/create-playlist', function (req, res) {
    var token = req.query.access_token;
    var id = req.query.id;
    var name = req.query.name;
    request.post({
        url: 'https://api.spotify.com/v1/users/' + id + '/playlists',
        body: JSON.stringify({
            'name': name,
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

app.get('/api/recommendations', function (req, res) {
    var artistID = req.query.artistid;
    var token = req.query.access_token;
    request.get({
        url: "https://api.spotify.com/v1/recommendations?seed_artists=" + artistID + "&limit=100",
        auth: {
            bearer: token
        }   
    }, function (recErr, recResponse, recBody) {
        res.json(recBody);
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
app.get('/api/addsongs', function (req, res) {
    var token = req.query.access_token; 
    var playlistid = req.query.playlistid;
    var userid = req.query.id;
    var uris = req.query.uris;
    request.post({
        url: 'https://api.spotify.com/v1/users/' + userid + '/playlists/' + playlistid + '/tracks?uris=' + uris,
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


// STEP 6: GET PLAYLIST
app.get('/api/getplaylist', function (req, res) {
    var token = req.query.access_token; 
    var playlistid = req.query.playlistid;
    var userid = req.query.id;
    request.get({
        url: 'https://api.spotify.com/v1/users/' + userid + '/playlists/' + playlistid,
        headers: {
            'Authorization': 'Bearer ' + token,
        },
        dataType:'json'
    }, function (searchErr, searchResponse, searchBody) {
        res.json(searchBody); 
    });
});


app.use(express.static('public'));
app.listen(PORT, function () {
    console.log('App listening on port ' + PORT)
});