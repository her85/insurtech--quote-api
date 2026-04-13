// src/routes/vehicle.routes.ts
import { Router } from 'express';
import * as vehicleController from '../controllers/vehicle.controller';
import { validate } from '../validations/validate';
import { searchVehiclesSchema } from '../validations/vehicle.validation';

/**
 * @swagger
 * tags:
 *   - name: Vehicles
 *     description: Endpoints to fetch vehicle brands, models and versions
 *
 * /api/vehicles/brands:
 *   get:
 *     summary: Get vehicle brands
 *     tags: [Vehicles]
 *     responses:
 *       200:
 *         description: List of brands
 *
 * /api/vehicles/brands/{brandId}/models:
 *   get:
 *     summary: Get models by brand
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: brandId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of models for the brand
 *
 * /api/vehicles/models/{modelId}/versions:
 *   get:
 *     summary: Get versions by model
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: modelId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of versions for the model
 *
 * /api/vehicles/search:
 *   get:
 *     summary: Search vehicles
 *     tags: [Vehicles]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: Search results
 */
const router = Router();

router.get('/brands', vehicleController.getBrands);
router.get('/brands/:brandId/models', vehicleController.getModelsByBrand);
router.get('/models/:modelId/versions', vehicleController.getVersionsByModel);
router.get('/search', validate(searchVehiclesSchema), vehicleController.searchVehicles);

export default router;
