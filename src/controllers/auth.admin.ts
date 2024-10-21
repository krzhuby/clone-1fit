import { Response } from "express";
import { NextFunction, Request } from "express";
import { PrismaClient } from "@prisma/client";
import passport, { use } from "passport";
import { sign } from "utils";
let prisma = new PrismaClient();

export class Admin {
  static async useAdminRole(req: Request, res: Response, next: NextFunction) {
    let { name, password } = req.body;

    if (name === "Admin" && password === "password1234") {
      let token = sign({ role: "admin" });

      res.json({
        success: true,
        token,
      });
    } else {
      res.json({
        success: false,
        message: "Wrong password or name ",
      });
    }
  }
}
