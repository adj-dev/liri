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
function initMethod() {
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
}



// Export the function
module.exports = { initMethod };
