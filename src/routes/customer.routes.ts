// src/routes/customer.routes.ts
import { Router } from 'express';
import * as customerController from '../controllers/customer.controller';
import { validate } from '../validations/validate';
import { createCustomerSchema } from '../validations/customer.validation';

/**
 * @swagger
 * tags:
 *   - name: Customers
 *     description: Customer management endpoints
 *
 * /api/customers:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Customer created
 *
 * /api/customers/{id}:
 *   get:
 *     summary: Get customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer data
 *
 * /api/customers/dni/{dni}:
 *   get:
 *     summary: Get customer by DNI
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: dni
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer data by DNI
 */
const router = Router();

router.post('/', validate(createCustomerSchema), customerController.createCustomer);
router.get('/:id', customerController.getCustomer);
router.get('/dni/:dni', customerController.getCustomerByDni);

export default router;