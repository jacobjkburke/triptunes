var express = require('express');
var app = express();
var request = require('request');

var PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
    console.log(new Date().getTime(), req.url);

    next();
});

// // These are my test client_credentials,
// // replace with your own key/secret
// var TWITTER_KEY = 'jndUEH1V9eJ9TBee9QAjz2KIA';
// var TWITTER_SECRET = 'FhX6suZqaPIragVdSqfIwarNBGnRlzxRmbsV1Px5zTZ7grM9Rl';

// // Exposes an endpoint that your app can call to make API requests to twitter
// app.get('/api/twitter', function (req, res) {
//     var search = req.query.q;

//     // First, make a post request to generate an access token,
//     // which is required to make further API requests.
//     request.post({
//         url: 'https://api.twitter.com/oauth2/token',
//         form: {
//             grant_type: 'client_credentials'
//         },
//         auth: {
//             username: TWITTER_KEY,
//             password: TWITTER_SECRET,
//             sendImmediately: true
//         },
//         json: true
//     }, function (authErr, authResponse, authJSON) {
//         // Once we have a token, add it to each API request we want to make.
//         request.get({
//             url: 'https://api.twitter.com/1.1/search/tweets.json?q=' + search,
//             auth: {
//                 bearer: authJSON.access_token
//             },
//             json: true
//         }, function (searchErr, searchResponse, searchBody) {
//             res.json(searchBody);
//         });
//     });
// });

// These are my test client_credentials,
// replace with your own id/secret
var SPOTIFY_ID = '6caad84a95784bd4bc074cad1f206774';
var SPOTIFY_SECRET = 'ea63300480cd47adbc64fb501b7c11ae';

app.get('/api/spotify', function (req, res) {
    var search = req.query.q;

    // Uses client credentials flow
    // See: https://developer.spotify.com/web-api/authorization-guide/#client-credentials-flow
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