import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const resetTokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    index: true,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  expiryTime: {
    type: Date,
    required: true,
    index: true
  },
  sentTo: {
    type: String
  }
}, { 
  timestamps: true, 
  versionKey: false 
});

const PasswordResetToken = mongoose.model("PasswordResetToken", resetTokenSchema, "password_reset_token");

export default PasswordResetToken;
