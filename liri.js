// Dependencies
require('dotenv').config();
const fs = require('fs');
const inquirer = require('inquirer');
const { callSpotify } = require('./modules/spotify.js');
const { callBandsintown } = require('./modules/bandsintown.js');
const { callOmdb } = require('./modules/omdb.js');
const { help } = require('./modules/help.js');



/**
 * Regular Expression IndexOf for Arrays
 * This little addition to the Array prototype will iterate over an array
 * and return the index of the first element which matches the provided
 * regular expression.
 * Note: This will not match on objects.
 * Credit: http://creativenotice.com/2013/07/regular-expression-in-array-indexof/
 * 
 * What is this used for? I use this custom method for improving the method I use 
 * for capturing the requested number of results for spotify-this-song commands.
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



// If spotify-this-song is recieved, check for user-determined number of results
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
      console.log('the "r" option must be set equal to a number between 1 and 20.\nThe default of 5 results has been implemented.');
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



/**
 * This is ground control, where all the magic happens. Major Tom is still out there somewhere,
 * hanging out in his tin can. Will he ever leave that tin can?
 */



// Define a function that prompts the user to choose a command
function promptCommands() {
  inquirer
    .prompt([
      {
        type: 'list',
        message: 'Choose a command:',
        choices: ['see upcoming events for an artist/band', 'search for a song on Spotify', 'get information about a movie'],
        name: 'command'
      }
    ])
    .then(choice => {
      let { command } = choice;

      // Use a switch to determine appropriate course of action
      switch (command) {
        case 'see upcoming events for an artist/band':
          promptEvent();
          break;
        case 'search for a song on Spotify':
          promptSong();
          break;
        case 'get information about a movie':
          promptMovie();
          break;
        default:
          promptCommands();
          break;
      }
    })
    .catch(err => {
      return console.log(err + ' inside promptCommands');
    });
}



// Asks user for an artist/band name and returns upcoming events
function promptEvent() {
  inquirer
    .prompt([
      {
        type: 'input',
        message: 'Enter an artist/band name:',
        name: 'artist'
      }
    ])
    .then(choice => {
      let { artist } = choice;
      callBandsintown(artist, function () {
        inquirer
          .prompt([
            {
              type: 'confirm',
              message: 'Search for another artist/band?',
              name: 'confirm',
              default: true
            }
          ])
          .then(answer => {
            let { confirm } = answer;
            if (confirm) {
              return promptEvent();
            }
            return promptCommands();
          })
          .catch(err => {
            return console.log(err + ' inside callBandsintown callback');
          })
      });
    })
    .catch(err => {
      return console.log(err + ' inside promptEvent');
    })
}



// Asks user for a song title and returns a specified number of results
function promptSong() {
  inquirer
    .prompt([
      {
        type: 'input',
        message: 'Enter a song:',
        name: 'song'
      }
    ])
    .then(answer => {
      // generate number of results to display -- this is handled with a function because it must
      // accomodate for case when user specifies a desired number of results
      let { song, numOfResults } = generateArguments(answer.song);
      callSpotify(song, numOfResults, function () {
        inquirer
          .prompt([
            {
              type: 'confirm',
              message: 'Search for another song?',
              name: 'confirm',
              default: true
            }
          ])
          .then(answer => {
            let { confirm } = answer;
            if (confirm) {
              return promptSong();
            }
            return promptCommands();
          })
          .catch(err => {
            return console.log(err + ' inside callSpotify callback');
          })
      });
    })
    .catch(err => {
      return console.log(err + ' inside promptSong')
    });
}



function promptMovie() {
  inquirer
    .prompt([
      {
        type: 'input',
        message: 'Enter a movie title:',
        name: 'movie'
      }
    ])
    .then(answer => {
      let { movie } = answer;
      callOmdb(movie, function () {
        inquirer
          .prompt([
            {
              type: 'confirm',
              message: 'Search for another movie?',
              name: 'confirm',
              default: true
            }
          ])
          .then(answer => {
            let { confirm } = answer;
            if (confirm) {
              return promptMovie();
            }
            return promptCommands();
          })
          .catch(err => {
            return console.log(err + ' inside callOmdb callback');
          })
      });
    })
    .catch(err => {
      console.log(err + ' inside promptMovie');
    });
}



promptCommands();


// // Handle case when command is do-what-it-says
// if (command === 'do-what-it-says') {
//   let result = fs.readFileSync('./random.txt', 'utf8').split(',');
//   command = result[0].toString();
//   arg = result.slice(1);
// }
