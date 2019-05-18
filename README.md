# liri-node-app
Find songs from Spotify, shows from Bands In Town, and movies from OMDB

When you search for a song the Spotify API will return you the top 5 results.
  - Want to add: specify the number of results you want

### Entering arguments
When adding any search term the user has the choice of entering an "explicit string", or an implicit string (no quotes). Liri will automatically handle it. If there are no results Liri will let the user know that 0 results were found. 

### Special Features
When using `spotify-this-song` the user has the option to specify a desired number of results by adding an additional argument: `r=[1-20]`. For example, the user could add `r=15` after writing out the song title and the application would return 15 results; `spotify-this-song "wonderwall" r=2` would return 2 songs related to "wonderwall". The user can ask for up to 20 results, and the default is 5. If the user attempts to use a number that is out of range, the default is used. Additionally, this argument can be added before or after the song title but must come after `spotify-this-song`.
