// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Error:', err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation error',
      errors: err.issues.map((issue: any) => ({
        field: issue.path.join('.'),
        message: issue.message
      }))
    });
  }

  // Prisma errors: usar cast a any para acceder a code/meta (evita problemas con tipos runtime)
  if ((err as any)?.code === 'P2002') {
    return res.status(409).json({
      message: 'Resource already exists',
      field: (err as any).meta?.target
    });
  }
  if ((err as any)?.code === 'P2025') {
    return res.status(404).json({
      message: 'Resource not found'
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message
    });
  }

  return res.status(500).json({
    message: 'Internal server error'
  });
};