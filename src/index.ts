import connectDB from "./config/db.config";
import express, { json, Express  } from 'express';
import cors from 'cors';
import routes from "./routes";
import helmet from "helmet";
import Middlewares from './middlewares';
connectDB();
const app: Express  = express();
app.use(cors({
    origin: '*',
}));
app.use(helmet());
app.use(json());
app.use('/api', routes);
app.all('*', (req,res,next) => {
    const err: any = new Error('The route can not be found');
    err.statusCode = 404;
    next(err)
})
app.use(Middlewares.errorHandler);
export default app;