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
