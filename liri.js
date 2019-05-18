/**
 * Regular Expression IndexOf for Arrays
 * This little addition to the Array prototype will iterate over an array
 * and return the index of the first element which matches the provided
 * regular expression.
 * Note: This will not match on objects.
 * Credit: This is not my intellectual property. http://creativenotice.com/2013/07/regular-expression-in-array-indexof/
 */
if (typeof Array.prototype.reIndexOf === 'undefined') {
  /**
   * @param {RegEx} rx The regular expression to test with. E.g. /-ba/gim
   * @return {Numeric} -1 means not found
   */
  Array.prototype.reIndexOf = function (rx) {
    for (var i in this) {
      if (this[i].toString().match(rx)) {
        return i;
      }
    }
    return -1;
  };
}


// Dependencies
require('dotenv').config();
const axios = require('axios');
const Spotify = require('node-spotify-api');

// Grab credentials for all API services
const { spotifyCred, omdbCred, bandsintownCred } = require('./keys.js');

// Set up the spotify API
const spotify = new Spotify(spotifyCred);

// Define a function for fetching Spotify data
function callSpotify(song, num) {
  spotify
    .search({ type: 'track', query: song, limit: num },
      // Handle response
      function (err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }

        console.log(`\nTop ${num} results\n\n-  *  -  *  -  *  -  *  -\n`);

        // Inform the user if there are no results
        if (data.tracks.items.length === 0) {
          return console.log(`Found 0 results for "${song}"\n`);
        }

        // Iterate through the results and display info for each song
        data.tracks.items.forEach(function (item) {
          /*
          The following console.log might look ugly, but it was the most straight-forward way I could think of
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
  axios
    .get(`http://www.omdbapi.com/?apikey=${omdbCred.key}&t=${title}`)
    .then(function (response) {
      console.log('\nMovie Result(s)\n\n-  *  -  *  -  *  -  *  -\n');

      // Inform the user if there are no results
      if (response.data.Response === 'False') {
        return console.log(`Found 0 results for "${title}"\n`);
      }

      let { Title, Year, Ratings, Country, Language, Plot, Actors } = response.data;
      // Separately grab the imdb and rottenTomatoes ratings
      let imdbRating = Ratings[0].Value;
      let rtRating = Ratings[1].Value;

      console.log(`${Title} (${Year}, ${Country}, ${Language})\nActors: ${Actors}\nPlot: ${Plot}\n${imdbRating} (imdb)\n${rtRating} (rottenTomatoes)\n\n-  *  -  *  -  *  -  *  -\n`);
    })
    .catch(function (err) {
      console.log(err);
    });
}

// Make a call to the Bandsintown API
function callBandsintown(artist) {
  axios
    .get(`https://rest.bandsintown.com/artists/${artist}/events?app_id=secret`)
    .then(function (response) {
      // Show how many results were found
      console.log(`\nFound ${response.data.length} upcoming events for ${artist}\n\n-  *  -  *  -  *  -  *  -\n`);

      // Iterate through each result and display the data
      response.data.forEach(function (event) {
        let { name, city, region, country } = event.venue;
        let { datetime } = event;

        console.log(`Venue: ${name}\nLocation: ${city}, ${region}, ${country}\nWhen: ${datetime}`);
        // If there are tickets available provide a link
        if (event.offers.length !== 0) {
          let { url } = event.offers[0];
          console.log(`Tickets available here: ${url}`);
        }
        // Separator
        console.log(`\n-  *  -  *  -  *  -  *  -\n`);
      });
    });
}

/*
This is ground control, where all the magic happens. Major Tom is still out there somewhere.
*/

// Snatch the arguments given by the user
const command = process.argv[2];

// Add all remaining args to an array, this allows the user to forgo quotes
let arg = process.argv.slice(3);

// Default number of results for spotify api
let numOfResults = '5';

// If spotify-this-song is recieved, check for user-determined number of results
let indexOfR = arg.reIndexOf(/r=/g);
if (command === 'spotify-this-song' && indexOfR !== -1) {
  // If r is a number 1-20 set the value of numOfResults to value of r
  if (arg[indexOfR].search(/^r=([1-9]|1[0-9]|20)$/g) !== -1) {
    numOfResults = arg.splice(indexOfR, 1)[0].split('=')[1];
    // If r is out of range then simply remove the r index from the array
  } else {
    arg.splice(indexOfR, 1);
    // Inform the user that r must be set to a number between 1 and 20
    console.log('the "r" option must be set equal to a number between 1 and 20.\nThe default of 5 results has been implemented.');
  }
}

// API calls will expect a string as an argument
arg = arg.join(' ');

switch (command) {
  case 'concert-this':
    callBandsintown(arg);
    break;
  case 'spotify-this-song':
    callSpotify(arg, numOfResults);
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
