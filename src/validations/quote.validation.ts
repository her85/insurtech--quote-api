// src/validations/quote.validation.ts
import { z } from 'zod';

export const calculateQuoteSchema = z.object({
  body: z.object({
    customerId: z.string()
      .uuid('Invalid customer ID'),
    
    versionId: z.string()
      .uuid('Invalid version ID'),
    
    coverageId: z.string()
      .uuid('Invalid coverage ID'),
    
    vehiclePlate: z.string()
      .regex(/^[A-Z]{2,3}\d{3}[A-Z]{2,3}$|^[A-Z]{3}\d{3}$/, 'Invalid plate format (e.g., ABC123 or AB123CD)')
      .optional()
      .transform(val => val?.toUpperCase()),
    
    vehicleUsage: z.enum(['particular', 'comercial', 'rideshare'] as const),
    
    insuredValue: z.number()
      .positive('Insured value must be positive')
      .min(100000, 'Insured value must be at least $100,000')
      .max(100000000, 'Insured value cannot exceed $100,000,000'),
    
    selectedAdditionals: z.array(z.string().uuid())
      .optional()
      .default([])
  })
});

export const getQuoteSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid quote ID')
  })
});

export const listQuotesSchema = z.object({
  query: z.object({
    customerId: z.string().uuid().optional(),
    status: z.enum(['pending', 'accepted', 'rejected', 'expired']).optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional().default(1),
    limit: z.string().regex(/^\d+$/).transform(Number).optional().default(10)
  })
});