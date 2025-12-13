import mongoose, { Schema, Document } from 'mongoose';

export interface IInventoryLog extends Document {
    sweetId: mongoose.Types.ObjectId;
    quantity: number;
    costPrice: number;
    supplier?: string;
    date: Date;
}

const InventoryLogSchema: Schema = new Schema({
    sweetId: { type: Schema.Types.ObjectId, ref: 'Sweet', required: true },
    quantity: { type: Number, required: true, min: 1 },
    costPrice: { type: Number, required: true, min: 0 },
    supplier: { type: String },
    date: { type: Date, default: Date.now }
});

export default mongoose.model<IInventoryLog>('InventoryLog', InventoryLogSchema);
