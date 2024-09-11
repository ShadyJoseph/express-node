import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    job: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    discordId: {
        type: String,
        unique: true,
        sparse: true, // allows the field to be unique but also allows it to be null
    },
    email: {
        type: String,
        unique: true, // Ensure emails are unique
        sparse: true, // Allows the field to be null for users who don't use Discord
    },
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

export default User;
