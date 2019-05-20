// Dependencies
require('dotenv').config();
const { initMethod } = require('./helpers/reIndexOf.js');
const { promptCommands } = require('./modules/prompts.js');



// Add custom method to Array prototype object
initMethod();



/**
 * This is ground control, where all the magic happens. Major Tom is still out there somewhere,
 * hanging out in his tin can. Will he ever leave his tin can? Let's go and find him...
 */
promptCommands();
