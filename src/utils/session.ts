import session from "express-session";
import dotenv from "dotenv";
dotenv.config();

const sessionFunc = () => {
  return session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
  });
};

export { sessionFunc };
