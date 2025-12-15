import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import User from '../models/User';
import Sweet from '../models/Sweet';

export const addFavorite = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        const { sweetId } = req.body;

        const sweet = await Sweet.findById(sweetId);
        if (!sweet) {
            const error: any = new Error('Sweet not found');
            error.statusCode = 404;
            throw error;
        }

        const user = await User.findById(userId);
        if (!user) {
            const error: any = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        if (user.favorites.includes(sweetId)) {
            return res.status(200).json({ message: 'Sweet already in favorites', favorites: user.favorites });
        }

        user.favorites.push(sweetId);
        await user.save();

        res.status(200).json({ message: 'Added to favorites', favorites: user.favorites });
    } catch (error) {
        next(error);
    }
};

export const removeFavorite = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        const { sweetId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            const error: any = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        user.favorites = user.favorites.filter((fav: any) => fav.toString() !== sweetId);
        await user.save();

        res.status(200).json({ message: 'Removed from favorites', favorites: user.favorites });
    } catch (error) {
        next(error);
    }
};

export const getFavorites = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate('favorites');

        if (!user) {
            const error: any = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json(user.favorites);
    } catch (error) {
        next(error);
    }
};
