// Dependencies
require('dotenv').config();
const axios = require('axios');
const Spotify = require('node-spotify-api');


// Grab credentials for all API services
const { spotifyCred, omdbCred } = require('./keys.js');

// Set up the spotify API
const spotify = new Spotify(spotifyCred);

// Define a function for fetching Spotify data
function fetchSpotify() {
  spotify.search({ type: 'track', query: 'All the Small Things' }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }

    console.log(data.tracks.items[0]);
  });
}

// Define a function for fetching OMDB data
function fetchOmdb() {
  axios.get(`http://www.omdbapi.com/?apikey=${omdbCred.key}&t=Anaconda`)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (err) {
      console.log(err);
    });
}


