import Sweet, { ISweet } from '../models/Sweet';

export class SweetService {
    async create(data: Partial<ISweet>) {
        const { name } = data;
        const existingSweet = await Sweet.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (existingSweet) {
            const error: any = new Error('Sweet with this name already exists');
            error.statusCode = 409;
            throw error;
        }

        const sweet = new Sweet(data);
        return await sweet.save();
    }

    async findAll(query: any) {
        const { search, category, page, limit } = query;
        let filter: any = {};

        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }
        if (category) {
            filter.category = category;
        }

        if (page && limit) {
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);
            const skip = (pageNum - 1) * limitNum;

            const total = await Sweet.countDocuments(filter);
            const sweets = await Sweet.find(filter).skip(skip).limit(limitNum);

            return {
                sweets,
                totalPages: Math.ceil(total / limitNum),
                currentPage: pageNum,
                totalSweets: total
            };
        }

        return await Sweet.find(filter);
    }

    async delete(id: string) {
        return await Sweet.findByIdAndDelete(id);
    }

    async update(id: string, data: Partial<ISweet>) {
        return await Sweet.findByIdAndUpdate(id, data, { new: true });
    }
}
