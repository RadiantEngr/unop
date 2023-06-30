import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userOtpSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  },
  otp: {
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

const UserOtp = mongoose.model('UserOtp', userOtpSchema, 'user_otp');

export default UserOtp;
