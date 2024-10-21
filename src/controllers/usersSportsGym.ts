import { Response } from "express";
import { NextFunction, Request } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class UserSportGymController {
  static async addUserToGymAndSport(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId, gymId, sportId } = req.body;

      const userSportGym = await prisma.userSportGym.create({
        data: {
          userId: Number(userId),
          gymId: Number(gymId),
          sportId: Number(sportId),
        },
      });

      res.json({
        success: true,
        message: "User added to gym and sport successfully",
        userSportGym,
      });
    } catch (error) {
      res.json({ success: false, message: "Something went wrong" });
    }
  }

  static async updateUserAssociation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const { gymId, sportId } = req.body;

      const updatedUserSportGym = await prisma.userSportGym.update({
        where: { id: Number(id) },
        data: {
          gymId: Number(gymId),
          sportId: Number(sportId),
        },
      });

      res.json({
        success: true,
        message: "User association updated successfully",
        updatedUserSportGym,
      });
    } catch (error) {
      console.log(error);

      res.json({ success: false, message: "Something went wrong" });
    }
  }

  static async deleteUserAssociation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      const association = await prisma.userSportGym.findUnique({
        where: { id: Number(id) },
      });

      if (!association) {
        return res
          .status(404)
          .json({ success: false, message: "User association not found." });
      }

      await prisma.userSportGym.delete({
        where: { id: Number(id) },
      });

      res.json({
        success: true,
        message: "User association deleted successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Something went wrong" });
    }
  }

  static async getAllUserAssociations(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userAssociations = await prisma.userSportGym.findMany({
        include: {
          user: true,
          gym: true,
          sport: true,
        },
      });

      res.json({ success: true, userAssociations });
    } catch (error) {
      res.json({ success: false, message: "Something went wrong" });
    }
  }

  static async getUserAssociationsByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = req.params;

      const userExists = await prisma.user.findUnique({
        where: { id: Number(userId) },
      });

      if (!userExists) {
        return res
          .status(404)
          .json({ success: false, message: "User not found." });
      }
      const userAssociations = await prisma.userSportGym.findMany({
        where: { userId: Number(userId) },
        include: {
          gym: true,
          sport: true,
        },
      });

      res.json({ success: true, userAssociations });
    } catch (error) {
      res.json({ success: false, message: "Something went wrong" });
    }
  }
}
