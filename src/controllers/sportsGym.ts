import { Response } from "express";
import { NextFunction, Request } from "express";
import { PrismaClient } from "@prisma/client";
let prisma = new PrismaClient();

export class SportsGymsController {
  static async addSportToGym(req: Request, res: Response, next: NextFunction) {
    try {
      const { gymId, sportId } = req.body;

      const gym = await prisma.gym.findFirst({ where: { id: gymId } });
      const sport = await prisma.sport.findFirst({ where: { id: sportId } });

      if (!gym || !sport) {
        return res
          .status(404)
          .json({ success: false, message: "Gym, Sport, or User not found." });
      }

      const data = await prisma.userSportGym.create({
        data: {
          gymId,
          sportId,
        },
      });

      res.json({
        success: true,
        message: "Sport added to gym successfully.",
        data,
      });
    } catch (error) {
      res.json({ success: false, message: "Something went wrong." });
    }
  }

  static async removeSportFromGym(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { gymId, sportId } = req.body;

      const data = await prisma.userSportGym.deleteMany({
        where: {
          gymId,
          sportId,
        },
      });

      if (data.count === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Association not found." });
      }

      res.json({
        success: true,
        message: "Sport removed from gym successfully.",
      });
    } catch (error) {
      res.json({ success: false, message: "Something went wrong." });
    }
  }

  static async getSportsByGym(req: Request, res: Response, next: NextFunction) {
    try {
      const { gymId } = req.params;

      const gym = await prisma.gym.findMany({
        where: { id: Number(gymId) },
        include: {
          sports: {
            select: {
              sport: true,
              user: true,
            },
          },
        },
      });

      if (!gym) {
        return res
          .status(404)
          .json({ success: false, message: "Gym not found." });
      }

      res.json({ success: true, data: gym });
    } catch (error) {
      res.json({ success: false, message: "Something went wrong." });
    }
  }

  static async getGymsBySport(req: Request, res: Response, next: NextFunction) {
    try {
      const { sportId } = req.params;

      const sport = await prisma.sport.findMany({
        where: { id: Number(sportId) },
        include: {
          gyms: {
            select: {
              gym: true,
              user: true,
            },
          },
        },
      });

      if (!sport) {
        return res
          .status(404)
          .json({ success: false, message: "Sport not found." });
      }

      res.json({ success: true, data: sport });
    } catch (error) {
      res.json({ success: false, message: "Something went wrong." });
    }
  }
}
