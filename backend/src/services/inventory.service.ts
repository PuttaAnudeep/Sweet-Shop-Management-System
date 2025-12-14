import Sweet from '../models/Sweet';
import InventoryLog from '../models/InventoryLog';

export class InventoryService {
    async addStock(data: { sweetId: string; quantity: number; costPrice: number; supplier?: string }) {
        const { sweetId, quantity, costPrice, supplier } = data;

        if (quantity <= 0) throw new Error('Quantity must be greater than 0');
        if (costPrice < 0) throw new Error('Cost price cannot be negative');

        const sweet = await Sweet.findById(sweetId);
        if (!sweet) {
            const error: any = new Error('Sweet not found');
            error.statusCode = 404;
            throw error;
        }

        // Add log
        const log = new InventoryLog({
            sweetId,
            quantity,
            costPrice,
            supplier
        });
        await log.save();

        // Update Sweet quantity
        sweet.quantity = Number(sweet.quantity) + Number(quantity);
        await sweet.save();

        return log;
    }
}
