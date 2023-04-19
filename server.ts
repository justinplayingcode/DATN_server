import dotenvConfig from './src/config/dotenv.config';
import app from './src';
dotenvConfig();

const port = process.env.APP_PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})