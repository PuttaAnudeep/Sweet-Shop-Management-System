import { Request, Response, NextFunction } from 'express';
import { SweetService } from '../services/sweet.service';
import User from '../models/User';

const sweetService = new SweetService();

export const createSweet = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { price, quantity } = req.body;
        if (price < 0 || quantity < 0) {
            const error: any = new Error('Price and Quantity cannot be negative');
            error.statusCode = 400;
            throw error;
        }
        const sweet = await sweetService.create(req.body);
        res.status(201).json(sweet);
    } catch (error) {
        next(error);
    }
};

export const listSweets = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sweets = await sweetService.findAll(req.query);
        res.status(200).json(sweets);
    } catch (error) {
        next(error);
    }
};

export const deleteSweet = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sweet = await sweetService.delete(req.params.id);
        if (!sweet) {
            const error: any = new Error('Sweet not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message: 'Sweet deleted successfully' });
    } catch (error) {
        next(error);
    }
};

export const updateSweet = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { price, quantity } = req.body;
        if ((price !== undefined && price < 0) || (quantity !== undefined && quantity < 0)) {
            const error: any = new Error('Price and Quantity cannot be negative');
            error.statusCode = 400;
            throw error;
        }
        const sweet = await sweetService.update(req.params.id, req.body);
        if (!sweet) {
            const error: any = new Error('Sweet not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json(sweet);
    } catch (error) {
        next(error);
    }
};

export const addComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { text } = req.body;
        const user = (req as any).user;

        if (!text) {
            const error: any = new Error('Comment text is required');
            error.statusCode = 400;
            throw error;
        }

        const userDetails = await User.findById(user.id);
        if (!userDetails) {
            const error: any = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        const comment = {
            user: user.id,
            username: userDetails.name,
            text
        };

        const sweet = await sweetService.addComment(req.params.id, comment);
        if (!sweet) {
            const error: any = new Error('Sweet not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json(sweet);
    } catch (error) {
        next(error);
    }
};
