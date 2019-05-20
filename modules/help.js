// Bring in chalk for some fancy shmancy
const chalk = require('chalk');

// Returns a list of all commands along with a few examples
function help(callback) {
  // Title section
  console.log(chalk`\n\n{bold.yellowBright LIRI Help Page}\n\n- * - * - * - * -`);

  // Commands
  console.log(
    chalk`
{yellowBright HOW TO USE}

LIRI allows you to search for upcoming events for an artist/band, find songs using
a Spotify API and get important information about a movie. These are the three main
functionalities of LIRI. To use any one of them simply select one of the first three
options and type what LIRI asks you to. 

Navigate using the UP/DOWN arrows, select an option with the ENTER key and use the
keyboard to enter any search-terms.

{bold A general tip: DO NOT} use quotes, as this could potentially throw off the APIs and 
throw an error -- not preferable. LIRI automatically takes all arguments you enter
as a single string.

{yellowBright MUNDANE}

You will notice that one of the options on the main menu is "Something incredibly
mundane". To affect the outcome of this feature you can simple open up "random.txt"
(it's in the root directory) and manually change the text. Must be a "command type"
followed by a "search term", separated by a comma. Now, here are some ground-rules:
  
  1. There can only be 1 (one) "entry" at a time in the file. So for example,
     "spotify-this-song,The way you Make Me Feel movie-this,The Departed" would most
     definitely throw an error. 
  2. You have 3 (three) choices for the "command": spotify-this-song OR movie-this OR 
     concert-this. 
  3. Don't, I repeat, {bold DON'T} use quotes for the search term: it won't do you any favors.
     It worked fine using quotes before inquirer was implemented, but no longer.

{yellowBright MISC}

Hit {bold cmd+C} any time to quit the application.

When searching for a song with Spotify, you can specify the number of results you want
by typing r=[number]. For example, r=2 will yield 2 results instead of defaulting to 5.
You can request up to 20 results.

  `
  )

  callback();
}



// Export the function
module.exports = { help }