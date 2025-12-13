import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password?: string;
    role: 'customer' | 'admin';
}

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
});

export default mongoose.model<IUser>('User', UserSchema);
