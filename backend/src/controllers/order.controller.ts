import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service';

const orderService = new OrderService();

export const placeOrder = async (req: any, res: Response, next: NextFunction) => {
    try {
        const order = await orderService.createOrder(req.user.id);
        res.status(201).json({ success: true, order });
    } catch (error: any) {
        if (error.message.includes('Insufficient stock') || error.message.includes('Cart is empty')) {
            error.statusCode = 400;
        }
        next(error);
    }
};
