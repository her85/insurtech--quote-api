# Sistema de Cotización de Seguros Automotor

API REST para cotización inteligente de seguros de vehículos con cálculo de riesgo personalizado.

## Stack Tecnológico

- **Backend**: Express.js + TypeScript
- **Database**: SQLite + Prisma ORM
- **Validación**: Zod
- **Documentación**: Swagger/OpenAPI
- **Seguridad**: Helmet, CORS, Rate Limiting

## Características

✅ Cálculo inteligente de primas basado en múltiples factores de riesgo
✅ Validaciones robustas en backend
✅ API RESTful completamente documentada con Swagger
✅ Rate limiting para prevenir abuso
✅ Logging de auditoría
✅ Sanitización de datos
✅ Gestión de errores centralizada

## Instalación

```bash
# Clonar repositorio
git clone <tu-repo>
cd insurtech-quote-api

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Setup completo (migración + seed)
npm run setup

# O paso a paso:
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## Desarrollo

```bash
# Modo desarrollo con hot reload
npm run dev

# Abrir Prisma Studio (GUI para ver la DB)
npm run prisma:studio

# Ver documentación Swagger
# http://localhost:3000/api-docs
```

## Endpoints Principales

### Vehículos
- `GET /api/vehicles/brands` - Listar marcas
- `GET /api/vehicles/brands/:brandId/models` - Modelos por marca
- `GET /api/vehicles/models/:modelId/versions` - Versiones por modelo
- `GET /api/vehicles/search` - Búsqueda avanzada

### Clientes
- `POST /api/customers` - Crear cliente
- `GET /api/customers/:id` - Obtener cliente
- `GET /api/customers/dni/:dni` - Buscar por DNI

### Coberturas
- `GET /api/coverages` - Listar coberturas
- `GET /api/coverages/:id` - Detalle de cobertura

### Cotizaciones
- `POST /api/quotes/calculate` - Calcular cotización
- `GET /api/quotes/:id` - Obtener cotización
- `GET /api/quotes` - Listar cotizaciones

## Cálculo de Prima

La prima se calcula mediante:

```
Prima Base (3-4% del valor asegurado)
× Factor Edad (18-25: +50%, 26-35: +20%, 36-60: base, 60+: +15%)
× Factor Antigüedad Vehículo (0-3 años: base, 4-10: +30%, 10+: +50%)
× Factor Zona (según riesgo del código postal)
× Factor Uso (particular: base, comercial: +40%, rideshare: +60%)
× Factor Género (estadístico)
× Factor Historial (sin siniestros: -20%, con siniestros: +30% a +100%)
× Multiplicador de Cobertura (RC: 1.0, Terceros: 1.5, Todo Riesgo: 2.2)
+ Adicionales seleccionados
```

## Deploy en Render

```bash
# Build command:
npm install && npm run prisma:generate && npm run build

# Start command:
npm start
```

## Estructura del Proyecto

```
src/
├── config/          # Configuraciones (Swagger, etc)
├── controllers/     # Controladores de rutas
├── middlewares/     # Middlewares (validación, errores, logs)
├── routes/          # Definición de rutas
├── services/        # Lógica de negocio
├── types/           # Tipos TypeScript
├── validations/     # Schemas de Zod
└── index.ts         # Entry point

prisma/
├── schema.prisma    # Schema de base de datos
└── seed.ts          # Datos iniciales
```

## Licencia

MIT