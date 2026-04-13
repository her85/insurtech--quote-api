// src/controllers/customer.controller.ts
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = await prisma.customer.create({
      data: {
        ...req.body,
        dateOfBirth: new Date(req.body.dateOfBirth),
        licenseDate: new Date(req.body.licenseDate)
      }
    });
    res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
};

export const getCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: req.params.id },
      include: {
        quotes: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        claims: true
      }
    });
    
    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }
    
    res.json(customer);
  } catch (error) {
    next(error);
  }
};

export const getCustomerByDni = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { dni: req.params.dni }
    });
    
    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }
    
    res.json(customer);
  } catch (error) {
    next(error);
  }
};