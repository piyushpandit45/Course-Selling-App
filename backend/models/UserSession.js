import mongoose from 'mongoose';

const userSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  deviceId: {
    type: String,
    required: true,
    default: 'unknown'
  },
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 30 * 24 * 60 * 60 // 30 days auto-expiry
  }
}, {
  timestamps: true
});

// Index for efficient queries
userSessionSchema.index({ userId: 1, createdAt: -1 });

// Static method to clean old sessions for a user
userSessionSchema.statics.cleanUserSessions = async function(userId) {
  try {
    return await this.deleteMany({ userId });
  } catch (error) {
    console.error('Session cleanup error:', error);
    return null;
  }
};

// Static method to validate session
userSessionSchema.statics.validateSession = async function(token) {
  try {
    return await this.findOne({ token });
  } catch (error) {
    console.error('Session validation error:', error);
    return null;
  }
};

// Static method to remove session by token
userSessionSchema.statics.removeSession = async function(token) {
  try {
    return await this.deleteOne({ token });
  } catch (error) {
    console.error('Session removal error:', error);
    return null;
  }
};

const UserSession = mongoose.model('UserSession', userSessionSchema);

export default UserSession;
