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

import { PaymentService } from '../services/payment.service';
const paymentService = new PaymentService();

export const checkout = async (req: any, res: Response, next: NextFunction) => {
    try {
        const session = await paymentService.createCheckoutSession(req.user.id);
        res.status(200).json({ success: true, sessionId: session.id, url: session.url });
    } catch (error: any) {
        next(error);
    }
};

export const handleSuccess = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { session_id } = req.query;
        if (!session_id) {
            throw new Error('Missing session_id');
        }
        const order = await paymentService.handlePaymentSuccess(session_id as string);
        res.status(200).json({ success: true, message: 'Payment Successful. Order Placed.', order });
    } catch (error: any) {
        next(error);
    }
};

export const getOrderHistory = async (req: any, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 5;

        const result = await orderService.getUserOrders(req.user.id, page, limit);
        res.status(200).json({ success: true, ...result });
    } catch (error: any) {
        next(error);
    }
};
