const pool = require('../db');

/**
 * Return all the badges for a user
 * id : the id of the user
 */
async function getUserBadges(id) {
  try {
    const badges = await pool.query(
      'SELECT * FROM project.user_badges ub, project.badges b WHERE ub.user_id = $1 AND ub.badge_id = b.badge_id',
      [id],
    );
    if (badges && badges.rows.length > 0) {
      return badges.rows;
    }
    return undefined;
  } catch (error) {
    return undefined;
  }
}

/**
 * Return all the badges of the database
 */
async function getAllBadges() {
  try {
    const allBadges = await pool.query('SELECT * FROM  project.badges ORDER BY badge_id  ASC');
    if (allBadges.rows.length > 0) {
      return allBadges.rows;
    }
    return undefined;
  } catch (error) {
    return undefined;
  }
}

/**
 * Add a badge to a user
 * currentUser : the id of the current user
 * label : the label of the badge to add
 */
async function addOneBadgeToUser(currentUser, label) {
  const idBadgeResult = await pool.query('SELECT badge_id FROM project.badges WHERE label = $1', [
    label,
  ]);

  if (idBadgeResult.rows.length > 0) {
    const idBadge = idBadgeResult.rows[0].badge_id;
    const insertResult = await pool.query(
      'INSERT INTO project.user_badges (user_id, badge_id) VALUES ($1, $2)',
      [currentUser, idBadge],
    );

    if (insertResult.rowCount > 0) {
      return insertResult.rows;
    }
  }
  return undefined;
}
module.exports = {
  getUserBadges,
  getAllBadges,
  addOneBadgeToUser,
};
