import User, { IUser } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'secret';

export class AuthService {
    async register(data: Partial<IUser>) {
        const { email, password } = data;
        if (!email || !password) {
            throw new Error('Missing email or password');
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

        // Return user without password
        const userObj = user.toObject();
        delete userObj.password;

        return { user: userObj, token };
    }
}
