// Dependencies
const axios = require('axios');



// Get auth keys for api
const { omdbCred } = require('../keys.js');



// Define a function for fetching OMDB data
function callOmdb(title) {
  if (!title) {
    title = 'Mr. Nobody';
  }
  axios
    .get(`http://www.omdbapi.com/?apikey=${omdbCred.key}&t=${title}`)
    .then(function (response) {
      console.log('\nFound a movie!\n\n-  *  -  *  -  *  -  *  -\n');

      // console.log(response.data);

      // Inform the user if there are no results
      if (response.data.Response === 'False') {
        return console.log(`Found 0 results for "${title}"\n`);
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

      console.log(`${Title} (${Year}, ${Country}, ${Language})\nActors: ${Actors}\nPlot: ${Plot}\n${imdbRating} (IMDB)\n${rtRating} (rottenTomatoes)\n\n-  *  -  *  -  *  -  *  -\n`);
    })
    .catch(function (err) {
      console.log(err.response);
    });
}



// Export function
module.exports = {
  callOmdb
}