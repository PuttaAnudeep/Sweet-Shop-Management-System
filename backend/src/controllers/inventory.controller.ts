import { Request, Response, NextFunction } from 'express';
import { InventoryService } from '../services/inventory.service';

const inventoryService = new InventoryService();

export const purchaseInventory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { sweetId, quantity, costPrice, supplier } = req.body;

        // Basic validation
        if (!sweetId || !quantity || !costPrice) {
            const error: any = new Error('Missing required fields');
            error.statusCode = 400;
            throw error;
        }

        const log = await inventoryService.addStock({ sweetId, quantity, costPrice, supplier });
        res.status(201).json({ success: true, data: log });
    } catch (error: any) {
        if (error.message === 'Sweet not found') {
            error.statusCode = 404;
        }
        next(error);
    }
};
