// utils/logActivity.js
const ActivityLog = require('../models/activitylog');

/**
 * Logs a user's activity.
 * @param {String} userId - The ID of the user.
 * @param {String} activityType - Category/type of activity (e.g., "Property", "Search").
 * @param {String} action - Description of the specific action (e.g., "Viewed property").
 * @param {Object} details - Optional metadata (e.g., { propertyId: "123" }).
 */
const logActivity = async (userId, activityType, action, details = {}) => {
  try {
    await ActivityLog.create({
      userId,
      activityType,
      action,
      details,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Error logging activity:", error);
    // Don't throw — avoid crashing the app over logging
  }
};

module.exports = logActivity;
