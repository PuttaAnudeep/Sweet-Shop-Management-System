import mongoose, { Schema, Document } from 'mongoose';

export interface ISweet extends Document {
    name: string;
    category: string;
    price: number;
    quantity: number;
    description?: string;
    image?: string;
    comments: {
        user: string; // User ID
        username: string;
        text: string;
        createdAt: Date;
    }[];
}

const SweetSchema: Schema = new Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 },
    description: { type: String },
    image: { type: String },
    comments: [{
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        username: { type: String, required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

export default mongoose.model<ISweet>('Sweet', SweetSchema);
