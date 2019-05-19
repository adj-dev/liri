// Dependencies
require('dotenv').config();
const fs = require('fs');
const { callSpotify } = require('./modules/spotify.js');
const { callBandsintown } = require('./modules/bandsintown.js');
const { callOmdb } = require('./modules/omdb.js');



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



/**
 * This is ground control, where all the magic happens. Major Tom is still out there somewhere,
 * hanging out in his tin can. Will he ever leave that tin can?
 */



// Snatch the arguments given by the user
let command = process.argv[2];



// Capturing all additional args as an array allows the user to forgo quotes
let arg = process.argv.slice(3);



// Handle case when command is do-what-it-says
if (command === 'do-what-it-says') {
  let result = fs.readFileSync('./random.txt', 'utf8').split(',');
  command = result[0].toString();
  arg = result.slice(1);
}



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
  default:
    console.log('Command not recognized');
    break;
}
