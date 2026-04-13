// src/controllers/coverage.controller.ts
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCoverages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, active } = req.query;
    
    const where: any = {};
    if (type) where.type = type;
    if (active !== undefined) where.active = active === 'true';
    
    const coverages = await prisma.coverage.findMany({
      where,
      include: {
        additionals: {
          where: { active: true }
        }
      },
      orderBy: { baseMultiplier: 'asc' }
    });
    
    res.json(coverages);
  } catch (error) {
    next(error);
  }
};

export const getCoverage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const coverage = await prisma.coverage.findUnique({
      where: { id },
      include: {
        additionals: {
          where: { active: true }
        }
      }
    });
    
    if (!coverage) {
      res.status(404).json({ message: 'Coverage not found' });
      return;
    }
    
    res.json(coverage);
  } catch (error) {
    next(error);
  }
};
