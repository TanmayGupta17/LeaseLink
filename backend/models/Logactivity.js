const mongoose = require('mongoose');

const logActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    activityType: {
      type: String,
      enum: [
        'login',
        'logout',
        'property_view',
        'property_create',
        'property_update',
        'property_delete',
        'search',
        'profile_update',
        'error',
      ],
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: { createdAt: 'timestamp', updatedAt: false },
  }
);

module.exports = mongoose.model('LogActivity', logActivitySchema);
