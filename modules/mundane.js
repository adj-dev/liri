// Dependencies
const fs = require('fs');



function doMundane(callback) {
  let contents = fs.readFileSync('./random.txt', 'utf8').split(',');
  let command = contents[0];
  let query = contents[1];

  switch (command) {
    case 'spotify-this-song':
      return callback('song', query);
    case 'concert-this':
      return callback('event', query);
    case 'movie-this':
      return callback('movie', query);
    default:
      break;
  }
}



// Export the function
module.exports = { doMundane };