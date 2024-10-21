import express, { Application } from "express";
import { ErrorHandlerMiddleware } from "middlewares";
import dotenv from "dotenv";
dotenv.config();
import router from "routes";
import passport from "passport";
import "./config/passportConfig";
import { sessionFunc } from "utils";

const app: Application = express();

app.use(express.json());

app.use(sessionFunc());

app.use(passport.initialize());
app.use(passport.session());
app.use(router);

app.use("/*", ErrorHandlerMiddleware.errorHandlerMiddleware);
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
