import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const {DATABASE_URI, DATABASE_URI_TEST, NODE_ENV} = process.env;

console.log(NODE_ENV==='test' ? 'testing' : 'production');

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect( NODE_ENV == 'test' ? DATABASE_URI_TEST : DATABASE_URI , {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
    } catch (err) {
        console.error(err);
    }
}

export default connectDB