import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
    sweetId: mongoose.Types.ObjectId;
    quantity: number;
}

export interface ICart extends Document {
    userId: mongoose.Types.ObjectId;
    items: ICartItem[];
}

const CartSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [
        {
            sweetId: { type: Schema.Types.ObjectId, ref: 'Sweet', required: true },
            quantity: { type: Number, required: true, min: 1 }
        }
    ]
}, { timestamps: true });

export default mongoose.model<ICart>('Cart', CartSchema);
