import { z } from 'zod';

export const createCustomerSchema = z.object({
  body: z.object({
    firstName: z.string()
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name must be less than 50 characters')
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'First name must contain only letters'),
    
    lastName: z.string()
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name must be less than 50 characters')
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Last name must contain only letters'),
    
    dni: z.string()
      .regex(/^\d{7,8}$/, 'DNI must be 7 or 8 digits'),
    
    email: z.string()
      .email('Invalid email format')
      .toLowerCase()
      .trim(),
    
    phone: z.string()
      .regex(/^[\d\s\-\+\(\)]{8,20}$/, 'Invalid phone format'),
    
    dateOfBirth: z.string()
      .refine((dateStr) => {
        const d = new Date(dateStr);
        return !Number.isNaN(d.getTime());
      }, 'Invalid date format')
      .refine((date) => {
        const d = new Date(date);
        const today = new Date();
        let age = today.getUTCFullYear() - d.getUTCFullYear();
        const m = today.getUTCMonth() - d.getUTCMonth();
        if (m < 0 || (m === 0 && today.getUTCDate() < d.getUTCDate())) {
          age--;
        }
        return age >= 18 && age <= 100;
      }, 'Age must be between 18 and 100 years'),
    
    gender: z.enum(['M', 'F', 'X']),
    
    address: z.string()
      .min(5, 'Address must be at least 5 characters')
      .max(200, 'Address must be less than 200 characters'),
    
    postalCode: z.string()
      .regex(/^[A-Z]?\d{4}[A-Z]{0,3}$/, 'Invalid postal code format'),
    
    city: z.string()
      .min(2, 'City must be at least 2 characters')
      .max(100, 'City must be less than 100 characters'),
    
    province: z.string()
      .min(2, 'Province must be at least 2 characters')
      .max(100, 'Province must be less than 100 characters'),
    
    licenseDate: z.string()
      .refine((dateStr) => {
        const d = new Date(dateStr);
        return !Number.isNaN(d.getTime());
      }, 'Invalid date format')
      .refine((date) => {
        const d = new Date(date);
        return d <= new Date();
      }, 'License date cannot be in the future'),
    
    licenseNumber: z.string()
      .min(5, 'License number must be at least 5 characters')
      .max(20, 'License number must be less than 20 characters')
  })
});

export const updateCustomerSchema = z.object({
  body: createCustomerSchema.shape.body.partial(),
  params: z.object({
    id: z.string().uuid('Invalid customer ID')
  })
});