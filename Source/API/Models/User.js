import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
      name: String,
      phone: String,
      email: String,
      address: String,
      gender: Number, // 0: Nữ, 1: Nam
});

export const User = mongoose.model('User', UserSchema);