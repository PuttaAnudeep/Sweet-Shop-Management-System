import User from '../models/User';
import Sweet from '../models/Sweet';
import Order from '../models/Order';

export class AdminService {
    async getStats() {
        const totalCustomers = await User.countDocuments({ role: 'customer' });
        const totalSweets = await Sweet.countDocuments();
        const liveSweets = await Sweet.countDocuments({ quantity: { $gt: 0 } });
        const outOfStockSweets = await Sweet.countDocuments({ quantity: 0 });
        const totalOrders = await Order.countDocuments();

        // Calculate total revenue from completed orders
        const revenueResult = await Order.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        return {
            totalCustomers,
            totalSweets,
            liveSweets,
            outOfStockSweets,
            totalOrders,
            totalRevenue
        };
    }
}
