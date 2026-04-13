// src/routes/index.ts
import { Router } from 'express';
import vehicleRoutes from './vehicle.routes';
import customerRoutes from './customer.routes';
import quoteRoutes from './quote.routes';
import coverageRoutes from './coverage.routes';

const router = Router();

router.use('/vehicles', vehicleRoutes);
router.use('/customers', customerRoutes);
router.use('/quotes', quoteRoutes);
router.use('/coverages', coverageRoutes);

export default router;