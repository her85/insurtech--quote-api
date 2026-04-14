// src/config/swagger.ts
import { Express } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const apis = process.env.NODE_ENV === 'production'
  ? ['./dist/routes/*.js', './dist/controllers/*.js']
  : ['./src/routes/*.ts', './src/controllers/*.ts'];

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
    servers: [],
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
  apis
};

export const swaggerSetup = (app: Express) => {
  try {
    const specs = swaggerJsdoc(options);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Quote API Docs'
    }));
  } catch (err) {
    // Si falla la generación/servicio de Swagger, no romper toda la app: devolver 503 en /api-docs
    // y registrar el error para revisar en los logs de la plataforma (Render, Heroku, etc.)
    // Mantener la API principal funcionando.
    // eslint-disable-next-line no-console
    console.error('Swagger setup error:', err);
    app.get('/api-docs', (_req, res) => {
      res.status(503).json({ message: 'Swagger disabled' });
    });
  }
};