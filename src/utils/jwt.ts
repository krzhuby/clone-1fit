import jwt from "jsonwebtoken";

const sign = (payload: any) => {
  return jwt.sign(payload, "SECRET_KEY");
};

const verify = (token: string) => {
  return jwt.verify(token, "SECRET_KEY");
};

export { sign, verify };
