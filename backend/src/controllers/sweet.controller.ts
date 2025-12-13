import { Request, Response, NextFunction } from 'express';
import { SweetService } from '../services/sweet.service';

const sweetService = new SweetService();

export const createSweet = async (req: Request, res: Response, next: NextFunction) => {
    try {
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
