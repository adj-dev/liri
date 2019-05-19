// Dependencies
const axios = require('axios');



// Make a call to the Bandsintown API
function callBandsintown(artist) {
  if (!artist) {
    return console.log('\n\nPlease enter an artist or band.\n\n')
  }
  axios
    .get(`https://rest.bandsintown.com/artists/${artist}/events?app_id=secret`)
    .then(function (response) {
      // Show how many results were found
      console.log(`\nFound ${response.data.length} upcoming events for ${artist}\n\n-  *  -  *  -  *  -  *  -\n`);

      // Iterate through each result and display the data
      response.data.forEach(function (event) {
        let { name, city, region, country } = event.venue;
        let { datetime } = event;

        console.log(`Venue: ${name}\nLocation: ${city}, ${region}, ${country}\nWhen: ${datetime}`);
        // If there are tickets available provide a link
        if (event.offers.length !== 0) {
          let { url } = event.offers[0];
          console.log(`Tickets available here: ${url}`);
        }
        // Separator
        console.log(`\n-  *  -  *  -  *  -  *  -\n`);
      });
    })
    .catch(function (err) {
      console.log(err.response);
    });
}



// Export the function
module.exports = {
  callBandsintown
}