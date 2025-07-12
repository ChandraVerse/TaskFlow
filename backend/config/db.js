import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://ChandraVerse:sekhar123456@cluster0.wlxz03v.mongodb.net/TaskFlow')
    .then(() => console.log('DB CONNECTED'));
}