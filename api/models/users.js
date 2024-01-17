const bcrypt = require('bcrypt');
const pool = require('../db');

module.exports = {
  getAllUsers,
  loginUser,
  registerUser,
  currentUser,
  updateUserPoint,
};

/**
 * Retrieves all the users of the database
 * userId : the id of the user
 */
async function getAllUsers() {
  const users = await pool.query(
    'SELECT * FROM project.users ORDER BY total_point DESC, pseudo ASC, user_id ASC',
  );
  if (users.rows.length > 0) {
    return users.rows;
  }
  return undefined;
}

/**
 * Authenticates a user by their username and password
 * username: Name entered by the user for login
 * password: The login password entered by the user
 */

async function loginUser(username, password) {
  const user = await pool.query('SELECT * FROM project.users WHERE pseudo = $1', [username]);

  if (user.rows.length > 0) {
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (validPassword) {
      return user;
    }
  }
  return user;
}

/**
 * Adds a new user to the db
 * username: The name the user chooses
 * password: The user chosen password
 */

async function registerUser(username, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await pool.query('INSERT INTO project.users (pseudo, password) VALUES ($1, $2)', [
    username,
    passwordHash,
  ]);

  if (user.rowCount > 0) {
    return user;
  }
  return user;
}

/**
 * Gets details of the current user
 * username: The user name
 */

async function currentUser(username) {
  const user = await pool.query('SELECT * FROM project.users WHERE pseudo = $1', [username]);

  if (user.rows.length > 0) {
    return user;
  }

  return user;
}

/**
 * Update the user's points
 * userId: the id of the user
 * score: the score to be added to the user's total points
 */
async function updateUserPoint(userId, score) {
  const points = await pool.query(
    'UPDATE project.users SET total_point = total_point + $1 WHERE user_id = $2 RETURNING total_point',
    [score.score, userId],
  );
  if (points.rowCount > 0) {
    return points.rows[0].total_point;
  }
  return undefined;
}
