# LIRI
Find songs from Spotify, shows from Bands In Town, and movies from OMDB.

## Installation and Getting Started
1. `git clone https://github.com/adj-dev/liri-node-app.git`
2. `cd liri-node-app`
3. `npm install`
4. `node liri.js`

## Entering arguments
When adding any search term the user has the choice of entering an "explicit string", or an implicit string (no quotes). Liri will automatically handle it. If there are no results Liri will let the user know that 0 results were found. 

## Commands
There are 5 different commands that the user can use.

### `spotify-this-song`
Takes a string that represents the title of a song. LIRI uses Spotify to return a list of 5 songs related to the given song title. 

If no song is specified the user will be involuntarily "rick-rolled". 

### `movie-this`
Takes a string that represents the title of a movie. LIRI uses OMDB to find information about the movie.

### `concert-this`
Takes a string that represents an artist/band name. LIRI uses the Bandsintown API to return a list of all upcoming events for said artist/band.

### `do-what-it-says`
A rather useless feature. LIRI reads a file named random.txt and makes an API call based on the text it finds.

### `help`
Provides a short list of examples and all possible commands.

## Special Features
When using `spotify-this-song` the user has the option to specify a desired number of results by adding an additional argument: `r=[1-20]`. For example, the user could add `r=15` after writing out the song title and the application would return 15 results; `spotify-this-song "wonderwall" r=2` would return 2 songs related to "wonderwall". The user can ask for up to 20 results, and the default is 5. If the user attempts to use a number that is out of range, the default is used. Additionally, this argument can be added before or after the song title but must come after `spotify-this-song`.
