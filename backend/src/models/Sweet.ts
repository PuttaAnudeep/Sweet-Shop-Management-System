import mongoose, { Schema, Document } from 'mongoose';

export interface ISweet extends Document {
    name: string;
    category: string;
    price: number;
    quantity: number;
    description?: string;
    image?: string;
}

const SweetSchema: Schema = new Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 },
    description: { type: String },
    image: { type: String }
}, { timestamps: true });

export default mongoose.model<ISweet>('Sweet', SweetSchema);
