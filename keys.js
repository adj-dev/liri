const spotifyCred = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
}

const omdbCred = {
  key: process.env.OMDB_KEY
}

const bandsintownCred = {
  key: process.env.BANDS_IN_TOWN_KEY
}

module.exports = {
  spotifyCred,
  omdbCred,
  bandsintownCred
};