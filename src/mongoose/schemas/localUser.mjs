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
    }
}, {
    timestamps: true,
});

// Prevent model overwrite
const LocalUser = mongoose.models.LocalUser || mongoose.model('LocalUser', userSchema);

export default LocalUser;
