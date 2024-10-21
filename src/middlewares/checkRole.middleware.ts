import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { verify } from "utils";

const checkRole = (allowedRoles: string[] | string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token: any = req.headers["token"];

    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }

    try {
      const decoded: any = verify(token);
      req.user = decoded;

      if (allowedRoles.includes(decoded.role)) {
        next();
      } else {
        return res
          .status(403)
          .json({ message: "You don't have permission, access denied" });
      }
    } catch {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

export default checkRole;
