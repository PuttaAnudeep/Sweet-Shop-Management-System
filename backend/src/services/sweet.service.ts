import Sweet, { ISweet } from '../models/Sweet';

export class SweetService {
    async create(data: Partial<ISweet>) {
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
}
