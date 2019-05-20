/*************************************
 * DEPENDENCIES and SETUP
*************************************/



const axios = require('axios');
const Spotify = require('node-spotify-api');
const { spotifyCred, omdbCred } = require('../keys.js');
const spotify = new Spotify(spotifyCred);
const chalk = require('chalk');



/*************************************
 * BANDSINTOWN 
*************************************/



// Make a call to the Bandsintown API
function callBandsintown(artist, callback) {
  if (!artist) {
    console.log('\n\nPlease enter an artist or band.\n\n');
    callback();
    return;
  }
  axios
    .get(`https://rest.bandsintown.com/artists/${artist}/events?app_id=secret`)
    .then(function (response) {
      // Catch an error when query contains quotes
      if (response.data === '\n{error=An error occurred while searching.}\n') {
        console.log('\nEnter an artist/band name without any quotes or special characters.\n');
        callback();
        return;
      }
      // Catch an error when query was not found
      if (response.data === '\n{warn=Not found}\n') {
        console.log(chalk`\nNo results for {bold ${artist}}\n`);
        callback();
        return;
      }
      // Show how many results were found
      console.log(`\n-  *  -  *  -  *  -  *  -\n`);
      // Iterate through each result and display the data
      response.data.forEach(function (event) {
        let { name, city, region, country } = event.venue;
        let { datetime } = event;

        console.log(chalk`{bold Venue:} {yellowBright ${name}}\n{bold Location:} ${city}, ${region}, ${country}\n{bold When:} ${datetime}`);
        // If there are tickets available provide a link
        if (event.offers.length !== 0) {
          let { url } = event.offers[0];
          console.log(chalk`{bold Tickets:} {cyan ${url}}`);
        }
        // Separator
        console.log(`\n-  *  -  *  -  *  -  *  -\n`);
      });
      // Display number of results
      console.log(chalk`Found {inverse ${response.data.length}} upcoming events for {bold.yellowBright ${artist}}\n`);
      // Run a callback function after data has been logged
      callback();
    })
    .catch(function (err) {
      console.log('\nTry that again...\n');
      callback();
    });
}



/*************************************
 * SPOTIFY
*************************************/



// Define a function for fetching Spotify data
function callSpotify(song, num, callback) {
  // Rick-roll the user if no song is provided
  if (!song) {
    song = 'Never Gonna Give You Up';
    num = 1;
  }
  spotify
    .search({ type: 'track', query: song, limit: num })
    .then(data => {
      // Inform the user if there are no results
      if (data.tracks.items.length === 0) {
        console.log(chalk`\nFound {inverse 0} results for "{bold.yellowBright ${song}}"\n`);
        callback();
        return;
      }
      // Show how many results were found
      console.log(chalk`\nTop {inverse ${num}} results\n\n-  *  -  *  -  *  -  *  -\n`);
      // Iterate through the results and display info for each song
      data.tracks.items.forEach(function (item) {
        /*
        The following console.log might look ugly, but it was the most straight-forward way I could think of
        to log the artist info to the console. The last injected variable in the template literal is a 
        tertiary expression to accomodate for the occasionally unavailable preview url: if the url is 
        present it will be set to the value of preview_url, otherwise if the url is NOT present it will 
        evaluate to a string that notifies the user.
        */
        console.log(chalk`"{bold.yellowBright ${item.name}}" by {yellowBright ${item.album.artists[0].name}}\n{bold Album:} ${item.album.name}\n{bold Preview:} {cyan ${item.preview_url ? item.preview_url : 'preview unavailable'}}\n\n-  *  -  *  -  *  -  *  -\n`)
      });
      callback();
    })
    .catch(err => {
      console.log('Error occurred: ' + err);
      callback();
    });
}



/**
 * Helper function
 * If spotify-this-song is recieved, check for a user-determined number of results
 * eg. r=13 
 */
function generateArguments(arg) {
  // Convert the string to an array for easier manipulation
  let song = arg.split(' ');
  let numOfResults = '5';
  // Look for "r=" in song title
  let indexOfR = song.reIndexOf(/r=/g);
  // If "r=" is found
  if (indexOfR !== -1) {
    // If "r" is a number 1-20 set numOfResults equal to "r" and simultaneously remove "r" from the song title
    if (song[indexOfR].search(/^r=([1-9]|1[0-9]|20)$/g) !== -1) {
      numOfResults = song.splice(indexOfR, 1)[0].split('=')[1];
      // If r is out of range then simply remove the r index from the array
    } else {
      // Inform the user that r must be set to a number between 1 and 20
      console.log(chalk`\n{underline the "r" option must be set equal to a number between 1 and 20.\nThe default of 5 results has been implemented.}`);
      // Remove the out-of-range "r" from the song title
      song.splice(indexOfR, 1);
    }
  }
  // Turn arg back into a string
  song = song.join(' ');
  // Return the necessary data
  return {
    song,
    numOfResults
  }
}



/*************************************
 * OMDB
*************************************/



// Define a function for fetching OMDB data
function callOmdb(title, callback) {
  if (!title) {
    title = 'Mr. Nobody';
  }
  axios
    .get(`http://www.omdbapi.com/?apikey=${omdbCred.key}&t=${title}`)
    .then(function (response) {
      // Inform the user if there are no results
      if (response.data.Response === 'False') {
        console.log(chalk`\nFound {inverse 0} results for "{bold ${title}}"\n`);
        callback();
        return;
      }

      // Separator
      console.log('\n-  *  -  *  -  *  -  *  -\n');

      // Assign data to variable
      let { Title, Year, Ratings, Country, Language, Plot, Actors } = response.data;
      // Separately grab the imdb and rottenTomatoes ratings
      let imdbRating = Ratings[0].Value;
      let rtRating;

      // Account for occasional unavailable ratings from RottenTomatoes
      if (Ratings.length === 1) {
        rtRating = 'N/A';
      } else {
        rtRating = Ratings[1].Value;
      }

      // Display info to user
      console.log(chalk`{bold.yellowBright ${Title}} (${Year})\n{bold Produced In:} ${Country}\n{bold Language(s):} ${Language}\n{bold Actors:} ${Actors}\n{bold Plot:} ${Plot}\n{yellowBright ${imdbRating}} (IMDB)\n{yellowBright ${rtRating}} (rottenTomatoes)\n\n-  *  -  *  -  *  -  *  -\n`);
      callback();
    })
    .catch(function (err) {
      // Handle a timeout
      if (err.status === 522) {
        console.log('Connection time-out. Maybe try another time?');
        callback();
        return;
      }
      callback();
    });
}



// Export as module
module.exports = {
  callBandsintown,
  callSpotify,
  callOmdb,
  generateArguments
}
