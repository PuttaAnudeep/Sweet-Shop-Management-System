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
        const { search, category } = query;
        let filter: any = {};

        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }
        if (category) {
            filter.category = category;
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
