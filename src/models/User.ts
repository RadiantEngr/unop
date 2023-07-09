import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "../config";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        unique: true
    },
    fullName: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "regular_user"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isLoggedIn: {
        type: Boolean,
        default: false
    },
    lastLoggedIn: {
        type: Date,
        default: null
    },
}, { timestamps: true })

userSchema.pre("save", async function (next) {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, config.saltRounds);
    }
    next();
  });

//prevent password and __v field from being sent on data fetch
userSchema.set("toJSON", {
    transform: function(doc, ret, opt) {
        delete ret["password"]
        delete ret["__v"]
        return ret
    }
})

const User = mongoose.model("User", userSchema, "user");

export default User;
