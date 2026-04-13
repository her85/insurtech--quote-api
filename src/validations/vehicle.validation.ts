// src/validations/vehicle.validation.ts
import { z } from 'zod';

export const searchVehiclesSchema = z.object({
  query: z.object({
    brandId: z.string().uuid('Invalid brand ID').optional(),
    modelId: z.string().uuid('Invalid model ID').optional(),
    year: z.string()
      .regex(/^\d{4}$/, 'Year must be 4 digits')
      .transform(Number)
      .refine((year) => {
        const currentYear = new Date().getFullYear();
        return year >= 1990 && year <= currentYear + 1;
      }, 'Year must be between 1990 and next year')
      .optional(),
    type: z.enum(['sedan', 'suv', 'pickup', 'hatchback', 'coupe']).optional()
  })
});

export const getVersionSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid version ID')
  })
});