// Dependencies
require('dotenv').config();
const axios = require('axios');
const Spotify = require('node-spotify-api');

// Grab credentials for all API services
const { spotifyCred, omdbCred, bandsintownCred } = require('./keys.js');

// Set up the spotify API
const spotify = new Spotify(spotifyCred);

// Define a function for fetching Spotify data
function callSpotify(song) {
  spotify.search({ type: 'track', query: song, limit: 5 }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    console.log('\nTop 5 songs\n\n-  *  -  *  -  *  -  *  -\n');
    data.tracks.items.forEach(function (item) {
      /*
      The following console.log might look ugly, but it was the least expensive way I could think of
      to log the artist info to the console. The last injected variable in the template literal is a 
      tertiary expression to accomodate for the occasionally unavailable preview url: if the url is 
      present it will be set to the value of preview_url, otherwise if the url is NOT present it will 
      evaluate to a string that notifies the user.
      */
      console.log(`"${item.name}" by ${item.album.artists[0].name}\nAlbum: ${item.album.name}\nPreview: ${item.preview_url ? item.preview_url : 'preview unavailable'}\n\n-  *  -  *  -  *  -  *  -\n`)
    });
  });
}

// Define a function for fetching OMDB data
function callOmdb(title) {
  axios.get(`http://www.omdbapi.com/?apikey=${omdbCred.key}&t=${title}`)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (err) {
      console.log(err);
    });
}

/*
This is ground control, where all the magic happens. Major Tom is still out there somewhere.
*/

// Snatch the arguments declared by the user
const command = process.argv[2];
const arg = process.argv[3];

switch (command) {
  case 'concert-this':
    console.log('concert');
    break;
  case 'spotify-this-song':
    callSpotify(arg);
    break;
  case 'movie-this':
    callOmdb(arg);
    break;
  case 'do-what-it-says':
    console.log('Do what it says');
    break;
  default:
    console.log('Command not recognized');
    break;
}
