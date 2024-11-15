/**
 * Generates a message object containing text and a timestamp.
 *
 * @param {string} text - The text of the message.
 * @returns {Object} An object with the message text and the creation timestamp.
 */
const generateMessage = (text) => {
  return {
    text: text,
    createdAt: new Date().getTime(),
  };
};

/**
 * Generates a location message object containing a URL and a timestamp.
 *
 * @param {string} url - The URL pointing to the location.
 * @returns {Object} An object with the URL and the creation timestamp.
 */
const generateLocationMessage = (url) => {
  return {
    url,
    createdAt: new Date().getTime(),
  };
};

module.exports = {
  generateMessage,
  generateLocationMessage
};