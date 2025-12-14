import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'secret';

export interface AuthRequest extends Request {
    user?: any;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        const error: any = new Error('Access denied. No token provided.');
        error.statusCode = 401;
        return next(error);
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (ex) {
        const error: any = new Error('Invalid token.');
        error.statusCode = 400;
        next(error);
    }
};

export const authorize = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            const error: any = new Error('Access denied. You do not have permission.');
            error.statusCode = 403;
            return next(error);
        }
        next();
    };
};
export const isAdmin = authorize(['admin']);
