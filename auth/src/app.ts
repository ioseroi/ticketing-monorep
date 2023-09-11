import express from 'express';
import 'express-async-errors'
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/sign-in";
import { signoutRouter } from "./routes/sign-out";
import { signupRouter } from "./routes/signup";
import { NotFound, errorHandler } from "@sggtickets/common";

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}));
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.get('*', () => {
    throw new NotFound();
})

app.use(errorHandler);

export { app };