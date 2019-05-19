// Dependencies
const Spotify = require('node-spotify-api');
const { spotifyCred } = require('../keys.js');



// Set up the spotify API
const spotify = new Spotify(spotifyCred);



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
      console.log(`\nTop ${num} results\n\n-  *  -  *  -  *  -  *  -\n`);
      // Inform the user if there are no results
      if (data.tracks.items.length === 0) {
        console.log(`Found 0 results for "${song}"\n`);
        callback();
        return;
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
      callback();
    })
    .catch(err => {
      console.log('Error occurred: ' + err);
      callback();
    });
}



// Export the function
module.exports = {
  callSpotify
}