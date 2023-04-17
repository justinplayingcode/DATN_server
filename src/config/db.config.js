import { connect } from 'mongoose';
import dotenvConfig from './dotenv.config';
dotenvConfig();
const connectDB = async () => {
    try {
        const conn = await connect(process.env.DB_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        console.log("DB connection successfully");
    } catch (error) {
        console.log(error);
        process.exit(1)
    };
};
export default connectDB;