import { Request, Response, NextFunction } from 'express';
import { CartService } from '../services/cart.service';

const cartService = new CartService();

export const getCart = async (req: any, res: Response, next: NextFunction) => {
    try {
        const cart = await cartService.getCart(req.user.id);
        res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
};

export const addToCart = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { sweetId, quantity } = req.body;
        const cart = await cartService.addToCart(req.user.id, { sweetId, quantity });
        res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
};

export const removeFromCart = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { sweetId } = req.params;
        const cart = await cartService.removeFromCart(req.user.id, sweetId);
        res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
};
