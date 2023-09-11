import express from 'express';
import 'express-async-errors'
import { json } from "body-parser";
import cookieSession from "cookie-session";
import {createTicketRouter} from "../routes/new";
import { NotFound, errorHandler, currentUser } from "@sggtickets/common";
import {showTicketRouter} from "../routes/show";
import {indexTicketRouter} from "../routes";
import {updateTicketRouter} from "../routes/update";

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}));
app.use(currentUser);
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.get('*', () => {
    throw new NotFound();
})

app.use(errorHandler);

export { app };