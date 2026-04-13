// src/routes/quote.routes.ts
import { Router } from 'express';
import * as quoteController from '../controllers/quote.controller';
import { validate } from '../validations/validate';
import { calculateQuoteSchema, getQuoteSchema, listQuotesSchema } from '../validations/quote.validation';
import { quoteRateLimiter } from '../middlewares/rateLimiter';

/**
 * @swagger
 * tags:
 *   - name: Quotes
 *     description: Quote calculation and retrieval
 *
 * /api/quotes/calculate:
 *   post:
 *     summary: Calculate an insurance quote
 *     tags: [Quotes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Calculated quote
 *
 * /api/quotes/{id}:
 *   get:
 *     summary: Get quote by ID
 *     tags: [Quotes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Quote details
 *
 * /api/quotes:
 *   get:
 *     summary: List quotes
 *     tags: [Quotes]
 *     responses:
 *       200:
 *         description: Quotes list
 */
const router = Router();

router.post('/calculate', quoteRateLimiter, validate(calculateQuoteSchema), quoteController.calculateQuote);
router.get('/:id', validate(getQuoteSchema), quoteController.getQuote);
router.get('/', validate(listQuotesSchema), quoteController.listQuotes);

export default router;