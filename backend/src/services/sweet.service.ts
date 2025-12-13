import Sweet, { ISweet } from '../models/Sweet';

export class SweetService {
    async create(data: Partial<ISweet>) {
        const sweet = new Sweet(data);
        return await sweet.save();
    }
}
