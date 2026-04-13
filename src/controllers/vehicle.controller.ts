// src/controllers/vehicle.controller.ts
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { ParsedQs } from "qs";

const prisma = new PrismaClient();

export const getBrands = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const brands = await prisma.brand.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
    });
    res.json(brands);
  } catch (error) {
    next(error);
  }
};

export const getModelsByBrand = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const models = await prisma.model.findMany({
      where: {
        brandId: req.params.brandId,
        active: true,
      },
      include: { brand: true },
      orderBy: { name: "asc" },
    });
    res.json(models);
  } catch (error) {
    next(error);
  }
};

export const getVersionsByModel = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const versions = await prisma.version.findMany({
      where: {
        modelId: req.params.modelId,
        active: true,
      },
      include: {
        model: {
          include: { brand: true },
        },
      },
      orderBy: { year: "desc" },
    });
    res.json(versions);
  } catch (error) {
    next(error);
  }
};

export const searchVehicles = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { brandId, modelId, year, type } = req.query;

    const where: any = { active: true };
    if (modelId) where.modelId = modelId;
    if (year) where.year = Number(year);

    const versions = await prisma.version.findMany({
      where,
      include: {
        model: {
          include: { brand: true },
        },
      },
      orderBy: { year: "desc" },
    });

    // Filtrar por brandId y type si están presentes
    const filteredVersions = versions.filter(
      (v: {
        model: {
          brandId: string | ParsedQs | (string | ParsedQs)[];
          type: string | ParsedQs | (string | ParsedQs)[];
        };
      }) => {
        if (brandId && v.model.brandId !== brandId) return false;
        if (type && v.model.type !== type) return false;
        return true;
      },
    );

    res.json(filteredVersions);
  } catch (error) {
    next(error);
  }
};
