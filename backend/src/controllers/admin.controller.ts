import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';

const adminService = new AdminService();

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const stats = await adminService.getStats();
        res.status(200).json({ success: true, stats });
    } catch (error) {
        next(error);
    }
};
