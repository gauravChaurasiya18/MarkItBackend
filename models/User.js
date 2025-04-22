import mongoose from "mongoose";
import bcrpyt from "bcrypt";

/**
 * User Schema
 * Represents a user in the database
 * The User has Name, Email, Password, Bio.
 */
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        default: "",
    },
});

// Pre-save hook to hash the password before saving the user document.
userSchema.pre("save", async function (next) {
    if(this.isModified("password")) 
    {
        this.password = await bcrpyt.hash(this.password, 10); // 10 salt rounds we are doing currently
    }
    next();
})

const User = mongoose.model("User", userSchema);

export default User;