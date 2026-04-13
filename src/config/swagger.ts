// src/config/swagger.ts
import { Express } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Quote API',
      version: '1.0.0',
      description: 'API para cotización inteligente de seguros de vehículos',
      contact: {
        name: 'API Support',
      }
    },
    servers: [
    ],
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'object' } }
          }
        },
        Customer: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            dni: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' }
          }
        },
        CreateCustomerDto: {
          type: 'object',
          required: ['firstName', 'lastName', 'dni'],
          properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            dni: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' }
          }
        },
        VehicleBrand: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' }
          }
        },
        VehicleModel: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            brandId: { type: 'string' },
            name: { type: 'string' }
          }
        },
        VehicleVersion: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            modelId: { type: 'string' },
            name: { type: 'string' },
            year: { type: 'integer' }
          }
        },
        Coverage: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            code: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number', format: 'float' }
          }
        },
        CalculateQuoteRequest: {
          type: 'object',
          required: ['vehicle', 'coverages'],
          properties: {
            customerId: { type: 'string' },
            vehicle: {
              type: 'object',
              properties: {
                brandId: { type: 'string' },
                modelId: { type: 'string' },
                versionId: { type: 'string' },
                year: { type: 'integer' }
              }
            },
            coverages: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of coverage ids'
            }
          }
        },
        Quote: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            customerId: { type: 'string' },
            vehicle: { type: 'object' },
            coverages: { type: 'array', items: { $ref: '#/components/schemas/Coverage' } },
            total: { type: 'number', format: 'float' },
            currency: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};

const specs = swaggerJsdoc(options);

export const swaggerSetup = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Quote API Docs'
  }));
};