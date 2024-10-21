import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { sports } from "models";
let prisma = new PrismaClient();

export class Sports {
  static async createSports(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;
      const nameToLower = name.toLowerCase();

      const isValidSport = Object.values(sports)
        .map((sport) => sport.toLowerCase())
        .includes(nameToLower);
      if (!isValidSport) {
        return res.status(400).json({
          success: false,
          message: `We couldn't find that ${name} in the predefined list.`,
        });
      }

      const existingSport = await prisma.sport.findFirst({
        where: { name: nameToLower },
      });
      if (existingSport) {
        return res.status(400).json({
          success: false,
          message: "This sport type already exists in the database.",
        });
      }

      const newSport = await prisma.sport.create({
        data: { name: nameToLower },
      });

      res.json({
        success: true,
        message: "Successfully created",
        data: newSport,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  }

  static async updateSport(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const numericId = Number(id);
      const { name } = req.body;
      const nameToLower = name.toLowerCase();

      const isValidSport = Object.values(sports)
        .map((sport) => sport.toLowerCase())
        .includes(nameToLower);
      if (!isValidSport) {
        return res.status(400).json({
          success: false,
          message: `We couldn't find that ${name} in the predefined list.`,
        });
      }

      const existingSport = await prisma.sport.findFirst({
        where: { name: nameToLower },
      });
      if (existingSport) {
        return res.status(400).json({
          success: false,
          message: "This sport type already exists in the database.",
        });
      }

      const updatedSport = await prisma.sport.update({
        where: { id: numericId },
        data: { name: nameToLower },
      });

      res.json({
        success: true,
        message: "Successfully updated",
        data: updatedSport,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  }

  static async deleteSport(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const numericId = Number(id);

      const sport = await prisma.sport.findUnique({ where: { id: numericId } });
      if (!sport) {
        return res.status(404).json({
          success: false,
          message: `Sport with id ${id} not found!`,
        });
      }

      await prisma.sport.delete({ where: { id: numericId } });
      res.json({
        success: true,
        message: `${sport.name} successfully deleted!`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  }

  static async getAllSports(req: Request, res: Response, next: NextFunction) {
    try {
      const sportsList = await prisma.sport.findMany();
      res.json({
        success: true,
        data: sportsList,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const numericId = Number(id);

      const sport = await prisma.sport.findUnique({
        where: { id: numericId },
        include: {
          gyms: {
            select: { gym: true },
          },
        },
      });

      if (!sport) {
        return res.status(404).json({
          success: false,
          message: "Sport with this id is not found",
        });
      }

      res.json({
        success: true,
        data: sport,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  }

  static async searchSport(req: Request, res: Response, next: NextFunction) {
    const { name } = req.query;

    if (typeof name !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid query parameter." });
    }

    const sportExists = Object.values(sports)
      .map((sport) => sport.toLowerCase())
      .includes(name.toLowerCase());

    if (!sportExists) {
      return res.status(404).json({
        success: false,
        message: `${name} does not exist in the predefined list.`,
      });
    }

    const sportData = await prisma.sport.findFirst({
      where: { name },
      include: {
        gyms: {
          select: { gym: true },
        },
      },
    });

    if (!sportData) {
      return res.status(404).json({
        success: false,
        message: `${name} does not exist in the database.`,
      });
    }

    res.json({
      success: true,
      data: sportData,
    });
  }
}
