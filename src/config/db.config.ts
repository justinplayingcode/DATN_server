import { ConnectOptions, connect } from 'mongoose';
import dotenvConfig from './dotenv.config';

dotenvConfig();
const connectDB = async () => {
    try {
        await connect(process.env.DB_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        } as ConnectOptions);
        console.log("DB connection successfully");
    } catch (error) {
        console.log(error);
        process.exit(1)
    };
};
export default connectDB;