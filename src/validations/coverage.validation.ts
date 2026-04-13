// src/validations/coverage.validation.ts
import { z } from 'zod';

export const listCoveragesSchema = z.object({
  query: z.object({
    type: z.enum(['RC', 'Terceros_Completos', 'Todo_Riesgo']).optional(),
    active: z.string()
      .transform(val => val === 'true')
      .optional()
  })
});

export const getCoverageSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid coverage ID')
  })
});