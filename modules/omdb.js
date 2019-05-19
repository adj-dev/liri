// Dependencies
const axios = require('axios');



// Get auth keys for api
const { omdbCred } = require('../keys.js');



// Define a function for fetching OMDB data
function callOmdb(title, callback) {
  if (!title) {
    title = 'Mr. Nobody';
  }
  axios
    .get(`http://www.omdbapi.com/?apikey=${omdbCred.key}&t=${title}`)
    .then(function (response) {
      console.log('\n-  *  -  *  -  *  -  *  -\n');

      // Inform the user if there are no results
      if (response.data.Response === 'False') {
        console.log(`Found 0 results for "${title}"\n\n-  *  -  *  -  *  -  *  -\n`);
        callback();
        return;
      }

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
      console.log(`${Title} (${Year}, ${Country}, ${Language})\nActors: ${Actors}\nPlot: ${Plot}\n${imdbRating} (IMDB)\n${rtRating} (rottenTomatoes)\n\n-  *  -  *  -  *  -  *  -\n`);
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



// Export function
module.exports = {
  callOmdb
}