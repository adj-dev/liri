/*************************************
 * DEPENDENCIES and SETUP
*************************************/



const inquirer = require('inquirer');
const { callSpotify, generateArguments, callBandsintown, callOmdb } = require('./calls.js');
const { doMundane } = require('./mundane.js');
const { help } = require('./help.js');



/*************************************
 * COMMANDS (MAIN MENU)
*************************************/



/**
 * A function that prompts the user to choose a command.
 * Everything starts with THIS function. It will initiate
 * calls to every other function within this module and
 * also indirectly calls other modules.
 */
function promptCommands() {
  inquirer
    .prompt([
      {
        type: 'list',
        message: 'What would you like LIRI to do?',
        choices: [
          'Find upcoming events for an artist/band',
          'Search for a song on Spotify',
          'Get information about a movie',
          'Something incredibly mundane',
          'HELP!',
          'QUIT'
        ],
        name: 'command'
      }
    ])
    .then(choice => {
      let { command } = choice;

      // Use a switch to determine appropriate course of action
      switch (command) {
        case 'Find upcoming events for an artist/band':
          promptEvent();
          break;
        case 'Search for a song on Spotify':
          promptSong();
          break;
        case 'Get information about a movie':
          promptMovie();
          break;
        case 'Something incredibly mundane':
          promptMundane();
          break;
        case 'HELP!':
          help(function () {
            promptCommands();
          });
          break;
        case 'QUIT':
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



/*************************************
 * EVENT (concert-this)
*************************************/



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



/*************************************
 * SONGS (spotify-this-song)
*************************************/



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



/*************************************
 * MOVIE (movie-this)
*************************************/



// Asks users for a movie title and returns a result
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



/*************************************
 * MUNDANE (do-what-it-says)
*************************************/



/**
 * Helper function for promptMundane() 
 * Prints out an explanatory message to apologize for offering such a mundane option
 */
function apologize() {
  console.log(
    `
Not sure what exactly just happened? Are you feeling confused? Do you spend 
hours every day contemplating the validity of obscure existential concepts? 
You should probably find someone to talk to about that - but I digress. What 
you just saw happened because LIRI read a file in the root directory of this 
application called "random.txt" and called one of the three main 
functionalities (Spotify, Bandsintown, or OMDB) based on what it found. When 
I originally wrote this feature, the content of "random.txt" was 
"spotify-this-song,I Want it that Way" and it probably still is because I 
sure don't plan on changing it. Personally, I find this feature to be pretty 
useless. I understand that the person who created the curriculum that induced 
me to produce this application wanted me to prove I was able to utilize the 
fs module, and so I included it. Anyways, I'm done venting now. If you want 
more information about how to affect the outcome of this feature please
reference the HELP! section.

Have a nice day, and enjoy using LIRI.

`
  )
}



// Asks user if they are sure they want to do something mundane, then takes appropriate action
function promptMundane() {
  inquirer
    .prompt([
      {
        type: 'confirm',
        message: 'Are you SURE you want to do something incredibly... mundane?',
        name: 'confirm',
        default: false
      }
    ])
    .then(answer => {
      let { confirm } = answer;
      if (confirm) {
        doMundane(function (type, term) {
          switch (type) {
            case 'song':
              callSpotify(term, '1', function () {
                apologize();
                promptCommands();
              });
              break;
            case 'event':
              callBandsintown(term, function () {
                promptCommands();
              });
              break;
            case 'movie':
              callOmdb(term, function () {
                promptCommands();
              });
              break;
            default:
              promptCommands();
          }
        });
        return;
      }
      // If user hits enter or selects to NOT confirm
      console.log('\nLIRI says, "Good choice"\n\nObviously, LIRI is biased against doing incredibly mundane things.\n\n')
      promptCommands();
      return;
    })
    .catch(err => {
      console.log(err + ' inside promptMundane')
    })
}



// Export as module
module.exports = { promptCommands }