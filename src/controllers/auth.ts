import { Response } from "express";
import { NextFunction, Request } from "express";
import { PrismaClient } from "@prisma/client";
import passport, { use } from "passport";
import { sign, verify } from "utils";
let prisma = new PrismaClient();

export class AuthController {
  static async getLogin(req: Request, res: Response, next: NextFunction) {
    try {
      passport.authenticate("google", {
        scope: ["profile", "email"],
      })(req, res);
    } catch (error) {
      res.json({
        success: false,
        message: "Something went wrong",
      });
    }
  }
  static async createUserLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    let data: any = req.user;
    let user = data.profile._json;

    let checkUser = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });
    let token;

    if (checkUser) {
      token = sign({ id: user.id, email: user.email, role: "user" });

      res.json({
        success: true,
        message: "You successfully login",
        token,
      });
    } else {
      token = sign({ id: user.id, email: user.email, role: "user" });

      await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
        },
      });
      res.json({
        success: true,
        message: "You successfully login",
        token,
      });
    }
  }
  static async getUserAssociations(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      let token: any = req.headers.token;
      let data: any = verify(token);
      if (data) {
        let userId = data?.id;
        const userAssociations = await prisma.userSportGym.findMany({
          where: { userId: Number(userId) },
          include: {
            gym: true,
            sport: true,
          },
        });
        if (userAssociations.length === 0) {
          return res.status(404).json({
            success: false,
            message: "No associations found for this user.",
          });
        }
        res.json({ success: true, userAssociations });              
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Something went wrong" });
    }
  }

  static async registerUserData(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      let { email, name, password } = req.body;
      let checkUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      let token;

      if (checkUser) {
        let user = await prisma.user.update({
          data: {
            name,
            password,
          },
          where: {
            email,
          },
        });

        token = sign({
          id: user.id,
          email: user.email,
          role: "user",
        });
      } else {
        let user = await prisma.user.create({
          data: {
            name,
            email,
            password,
          },
        });

        token = sign({
          id: user.id,
          email: user.email,
          role: "user",
        });
      }

      res.json({
        success: true,
        message: "Successfully registered",
        token,
      });
    } catch (error) {
      res.json({
        success: false,
        message: "Something went wrong",
      });
    }
  }
}
