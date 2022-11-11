import mongoose, {Model} from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import logger from "../config/logger";

interface IUser {
    full_name: string;
    email: string;
    password: string;
    address: string;
    phone_number: string;
    age: number;
    profile_photo_path: string;
    token?: string;
    refreshToken?: string;
}
interface IUserMethods {
    comparePassword: (password: string) => Promise<boolean>;
    generateToken: (rememberMe?:boolean) => Promise<string>;
}
  
type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    phone_number: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: Number,
        required: true,
        trim: true,
    },
    profile_photo_path: {
        type: String,
        // required: true,
        trim: true,
    },
    token: {
        type: String,
        trim: true,
    },
    refreshToken: {
        type: String,
        trim: true,
    },
});

userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    
    bcrypt.genSalt(Number(process.env.SALTROUNDS)|| 10, (err, salt) => {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateToken = async function (rememberMe: boolean = false) {
    try {
        const user = this;
        if(!process.env.JWT_SECRET){
            throw new Error("JWT_SECRET not defined");
        }
        const token = jwt.sign({ _id: user._id, email:user.email }, process.env.JWT_SECRET, { expiresIn: '10m' });
        const refreshToken = jwt.sign({ _id: user._id, }, process.env.JWT_SECRET, { expiresIn: rememberMe?'7d':'1d' });
        user.token = token;
        user.refreshToken = refreshToken;
        await user.save();
        return token;
    } catch (err) {
        logger.error(err);
    }
}

const User = mongoose.model<IUser, UserModel>('User', userSchema);

export default User;