# LIRI
Find songs from Spotify, shows from Bands In Town, and movies from OMDB.

## Installation and Getting Started
1. `git clone https://github.com/adj-dev/liri-node-app.git`
2. `cd liri-node-app`
3. `npm install`
4. `node liri.js`

## Entering arguments
When adding any search term quotes are not recommended, they could throw off the APIs, though Liri will attempt to handle it. If there are no results Liri will let the user know that 0 results were found. 

## Commands
There are 6 different commands that the user can use.

### Find upcoming events for an artist/band
_Formerly known as_ `concert-this`

Takes a string that represents an artist/band name. LIRI uses the Bandsintown API to return a list of all upcoming events for said artist/band.

### Search for a song on Spotify
_Formerly known as_ `spotify-this-song`

Takes a string that represents the title of a song. LIRI uses Spotify to return a list of 5 songs related to the given song title. 
If no song is specified the user will be involuntarily "rick-rolled". 

### Get information about a movie
_Formerly known as_ `movie-this`

Takes a string that represents the title of a movie. LIRI uses OMDB to find information about the movie.

### Something incredibly mundane
_Formerly known as_ `do-what-it-says`

A rather useless feature. LIRI reads a file named random.txt and makes an API call based on the text it finds.

### HELP!

Provides a description of what LIRI is and directions for basic use. 

### QUIT

Exits from the application loop and ends the process.

## Special Features

When searching for a song the user has the option to specify a desired number of results by adding an additional argument: `r=[1-20]`. For example, the user could add `r=15` after writing out the song title and LIRI would return 15 results;  `billie jean r=2` would return 2 songs related to "billie jean". The user can ask for up to 20 results, and the default is 5. If the user attempts to use a number that is out of range, the default is used. Additionally, this argument can be added before or after the song title (it can even go in-between words of a song title as long as there are spaces separating all the words).
