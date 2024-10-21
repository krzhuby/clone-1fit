// gymsController.ts
import { Response } from "express";
import { NextFunction, Request } from "express";
import { PrismaClient } from "@prisma/client";
import { gyms } from "models";
const prisma = new PrismaClient();

export class Gyms {
  static async createGym(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;
      const nameToLower = name.toLowerCase();

      const gymExists = Object.values(gyms)
        .map((gym) => gym.toLowerCase())
        .some((gym) => gym.includes(nameToLower));

      if (!gymExists) {
        return res.status(400).json({
          success: false,
          message: `We couldn't find that ${name} in the predefined list.`,
        });
      }

      const existingGym = await prisma.gym.findFirst({
        where: { name: nameToLower },
      });
      if (existingGym) {
        return res.status(400).json({
          success: false,
          message: "This gym already exists in the database.",
        });
      }

      // Create the gym in the database
      const newGym = await prisma.gym.create({
        data: { name: nameToLower },
      });

      res.json({
        success: true,
        message: "Successfully created",
        data: newGym,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  }

  static async updateGym(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const numericId = Number(id);
      const { name } = req.body;
      const nameToLower = name.toLowerCase();

      // Check if the gym exists in the predefined list
      const isValidGym = Object.values(gyms)
        .map((gym) => gym.toLowerCase())
        .includes(nameToLower);
      if (!isValidGym) {
        return res.status(400).json({
          success: false,
          message: `We couldn't find that ${name} in the predefined list.`,
        });
      }

      // Check if the gym already exists in the database
      const existingGym = await prisma.gym.findFirst({
        where: { name: nameToLower },
      });
      if (existingGym) {
        return res.status(400).json({
          success: false,
          message: "This gym already exists in the database.",
        });
      }

      // Update the gym in the database
      const updatedGym = await prisma.gym.update({
        where: { id: numericId },
        data: { name: nameToLower },
      });

      res.json({
        success: true,
        message: "Successfully updated",
        data: updatedGym,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  }

  static async deleteGym(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const numericId = Number(id);

      const gym = await prisma.gym.findUnique({ where: { id: numericId } });
      if (!gym) {
        return res.status(404).json({
          success: false,
          message: `Gym with id ${id} not found!`,
        });
      }

      await prisma.gym.delete({ where: { id: numericId } });
      res.json({
        success: true,
        message: `${gym.name} successfully deleted!`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  }

  static async getAllGyms(req: Request, res: Response, next: NextFunction) {
    try {
      const gymsList = await prisma.gym.findMany();
      res.json({
        success: true,
        data: gymsList,
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

      const gym = await prisma.gym.findUnique({
        where: { id: numericId },
        include: {
          sports: {
            select: { sport: true },
          },
        },
      });

      if (!gym) {
        return res.status(404).json({
          success: false,
          message: "Gym with this id is not found",
        });
      }

      res.json({
        success: true,
        data: gym,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  }

  static async searchGym(req: Request, res: Response, next: NextFunction) {
    const { name } = req.query;

    if (typeof name !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid query parameter." });
    }

    const gymExists = Object.values(gyms)
      .map((gym) => gym.toLowerCase())
      .some((gym) => gym.includes(name.toLowerCase()));

    if (!gymExists) {
      return res.status(404).json({
        success: false,
        message: `${name} does not exist in the predefined list.`,
      });
    }

    const gymData = await prisma.gym.findFirst({
      where: { name },
      include: {
        sports: {
          select: { sport: true },
        },
      },
    });

    if (!gymData) {
      return res.status(404).json({
        success: false,
        message: `${name} does not exist in the database.`,
      });
    }

    res.json({
      success: true,
      data: gymData,
    });
  }
}
