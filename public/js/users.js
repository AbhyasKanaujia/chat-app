const users = [];

/**
 * Adds a user to the users array.
 *
 * @param {Object} user - A user object with id, username, and room.
 * @returns {Object} The user object that was added or an error message.
 */
const addUser = ({ id, username, room }) => {
  // Clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // Validate the data
  if (!username || !room) {
    return {
      error: "Username and room are required",
    };
  }

  // Check for existing user
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  // Validate username
  if (existingUser) {
    return {
      error: "Username is in use",
    };
  }

  // Store user
  const user = { id, username, room };
  users.push(user);
  return user;
};

/**
 * Removes a user from the users array.
 *
 * @param {string} id - The user's socket id.
 * @returns {Object} The user object that was removed or undefined.
 */
const removeUser = (id) => {
  // Find the index of the user
  const index = users.findIndex((user) => user.id === id);

  // Check if the user is found
  if (index !== -1) {
    // Return the user object that was removed
    return users.splice(index, 1)[0];
  }
};

/**
 * Finds a user by their id.
 *
 * @param {string} id - The user's socket id.
 * @returns {Object} The user object or undefined.
 */
const getUser = (id) => {
  return users.find((user) => user.id === id);
};

/**
 * Finds all users in a specific room.
 *
 * @param {string} room - The room name.
 * @returns {Array} An array of user objects.
 */
const getUsersInRoom = (room) => {
  room = room.trim().toLowerCase();
  return users.filter((user) => user.room === room);
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};