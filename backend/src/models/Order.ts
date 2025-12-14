import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
    sweetId: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
}

export interface IOrder extends Document {
    userId: mongoose.Types.ObjectId;
    items: IOrderItem[];
    totalAmount: number;
    paymentId?: string;
    status: 'pending' | 'completed' | 'cancelled';
}

const OrderSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            sweetId: { type: Schema.Types.ObjectId, ref: 'Sweet', required: true },
            quantity: { type: Number, required: true, min: 1 },
            price: { type: Number, required: true, min: 0 }
        }
    ],
    totalAmount: { type: Number, required: true, min: 0 },
    paymentId: { type: String, required: false },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'completed' }
}, { timestamps: true });

export default mongoose.model<IOrder>('Order', OrderSchema);
