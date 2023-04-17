import connectDB from "./config/db.config";
import express, { json } from 'express';
import cors from 'cors';
import routes from "./routes";
import helmet from "helmet";
import { errorHandler } from './middlewares/errorHandle.js';
connectDB();
const app = express();
app.use(cors());
app.use(helmet())
app.use(json());
app.use('/api', routes);
app.all('*', (req,res,next) => {
    const err = new Error('The route can not be found');
    err.statusCode = 404;
    next(err)
})
app.use(errorHandler);
export default app;