import Sweet from '../models/Sweet';
import InventoryLog from '../models/InventoryLog';

export class InventoryService {
    async addStock(data: { sweetId: string; quantity: number; costPrice: number; supplier?: string }) {
        const { sweetId, quantity, costPrice, supplier } = data;

        const sweet = await Sweet.findById(sweetId);
        if (!sweet) {
            throw new Error('Sweet not found');
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
