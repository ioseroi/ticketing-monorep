import express from 'express';
import 'express-async-errors'
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { NotFound, errorHandler, currentUser } from "@sggtickets/common";
import {createChargeRouter} from './routes/new'
const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}));
app.use(currentUser);
app.use(createChargeRouter)

app.get('*', () => {
    throw new NotFound();
})

app.use(errorHandler);

export { app };