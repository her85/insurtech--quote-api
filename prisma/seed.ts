// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Limpiar base de datos en orden correcto (por las foreign keys)
  console.log('🗑️  Cleaning database...');
  // Primero eliminar audit logs para evitar referencias
  await prisma.auditLog.deleteMany();
  // Luego eliminar entidades relacionadas a Customer (Quote, Claim) y por último los Customers
  console.log('🧹 Deleting Quote and Claim records related to customers...');
  await prisma.quote.deleteMany();
  await prisma.claim.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.coverageAdditional.deleteMany();
  await prisma.coverage.deleteMany();
  await prisma.version.deleteMany();
  await prisma.model.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.riskZone.deleteMany();
  console.log('✅ Database cleaned');

  // 1. MARCAS
  const volkswagen = await prisma.brand.create({
    data: { name: 'Volkswagen', logo: 'vw-logo.png' }
  });

  const fiat = await prisma.brand.create({
    data: { name: 'Fiat', logo: 'fiat-logo.png' }
  });

  const chevrolet = await prisma.brand.create({
    data: { name: 'Chevrolet', logo: 'chevrolet-logo.png' }
  });

  const toyota = await prisma.brand.create({
    data: { name: 'Toyota', logo: 'toyota-logo.png' }
  });

  const ford = await prisma.brand.create({
    data: { name: 'Ford', logo: 'ford-logo.png' }
  });

  const renault = await prisma.brand.create({
    data: { name: 'Renault', logo: 'renault-logo.png' }
  });

  const peugeot = await prisma.brand.create({
    data: { name: 'Peugeot', logo: 'peugeot-logo.png' }
  });

  console.log('✅ Brands created');

  // 2. MODELOS Y VERSIONES
  // Volkswagen
  await prisma.model.create({
    data: {
      name: 'Gol',
      brandId: volkswagen.id,
      type: 'hatchback',
      versions: {
        create: [
          { year: 2024, fiscalValue: 15000000, fuelType: 'nafta', engineSize: 1.6 },
          { year: 2023, fiscalValue: 13500000, fuelType: 'nafta', engineSize: 1.6 },
          { year: 2022, fiscalValue: 12000000, fuelType: 'nafta', engineSize: 1.6 },
        ]
      }
    }
  });

  await prisma.model.create({
    data: {
      name: 'Polo',
      brandId: volkswagen.id,
      type: 'hatchback',
      versions: {
        create: [
          { year: 2024, fiscalValue: 22000000, fuelType: 'nafta', engineSize: 1.6 },
          { year: 2023, fiscalValue: 20000000, fuelType: 'nafta', engineSize: 1.6 },
        ]
      }
    }
  });

  await prisma.model.create({
    data: {
      name: 'Taos',
      brandId: volkswagen.id,
      type: 'suv',
      versions: {
        create: [
          { year: 2024, fiscalValue: 45000000, fuelType: 'nafta', engineSize: 1.4 },
          { year: 2023, fiscalValue: 42000000, fuelType: 'nafta', engineSize: 1.4 },
        ]
      }
    }
  });

  // Fiat
  await prisma.model.create({
    data: {
      name: 'Cronos',
      brandId: fiat.id,
      type: 'sedan',
      versions: {
        create: [
          { year: 2024, fiscalValue: 16000000, fuelType: 'nafta', engineSize: 1.3 },
          { year: 2023, fiscalValue: 14500000, fuelType: 'nafta', engineSize: 1.3 },
          { year: 2022, fiscalValue: 13000000, fuelType: 'nafta', engineSize: 1.3 },
        ]
      }
    }
  });

  await prisma.model.create({
    data: {
      name: 'Argo',
      brandId: fiat.id,
      type: 'hatchback',
      versions: {
        create: [
          { year: 2024, fiscalValue: 15500000, fuelType: 'nafta', engineSize: 1.3 },
          { year: 2023, fiscalValue: 14000000, fuelType: 'nafta', engineSize: 1.3 },
        ]
      }
    }
  });

  await prisma.model.create({
    data: {
      name: 'Pulse',
      brandId: fiat.id,
      type: 'suv',
      versions: {
        create: [
          { year: 2024, fiscalValue: 25000000, fuelType: 'nafta', engineSize: 1.3 },
          { year: 2023, fiscalValue: 23000000, fuelType: 'nafta', engineSize: 1.3 },
        ]
      }
    }
  });

  // Chevrolet
  await prisma.model.create({
    data: {
      name: 'Onix',
      brandId: chevrolet.id,
      type: 'hatchback',
      versions: {
        create: [
          { year: 2024, fiscalValue: 17000000, fuelType: 'nafta', engineSize: 1.0 },
          { year: 2023, fiscalValue: 15500000, fuelType: 'nafta', engineSize: 1.0 },
          { year: 2022, fiscalValue: 14000000, fuelType: 'nafta', engineSize: 1.0 },
        ]
      }
    }
  });

  await prisma.model.create({
    data: {
      name: 'Tracker',
      brandId: chevrolet.id,
      type: 'suv',
      versions: {
        create: [
          { year: 2024, fiscalValue: 28000000, fuelType: 'nafta', engineSize: 1.2 },
          { year: 2023, fiscalValue: 26000000, fuelType: 'nafta', engineSize: 1.2 },
        ]
      }
    }
  });

  // Toyota
  await prisma.model.create({
    data: {
      name: 'Corolla',
      brandId: toyota.id,
      type: 'sedan',
      versions: {
        create: [
          { year: 2024, fiscalValue: 35000000, fuelType: 'nafta', engineSize: 2.0 },
          { year: 2023, fiscalValue: 32000000, fuelType: 'nafta', engineSize: 2.0 },
        ]
      }
    }
  });

  await prisma.model.create({
    data: {
      name: 'Hilux',
      brandId: toyota.id,
      type: 'pickup',
      versions: {
        create: [
          { year: 2024, fiscalValue: 50000000, fuelType: 'diesel', engineSize: 2.8 },
          { year: 2023, fiscalValue: 47000000, fuelType: 'diesel', engineSize: 2.8 },
        ]
      }
    }
  });

  // Ford
  await prisma.model.create({
    data: {
      name: 'EcoSport',
      brandId: ford.id,
      type: 'suv',
      versions: {
        create: [
          { year: 2023, fiscalValue: 24000000, fuelType: 'nafta', engineSize: 1.5 },
          { year: 2022, fiscalValue: 22000000, fuelType: 'nafta', engineSize: 1.5 },
        ]
      }
    }
  });

  await prisma.model.create({
    data: {
      name: 'Ranger',
      brandId: ford.id,
      type: 'pickup',
      versions: {
        create: [
          { year: 2024, fiscalValue: 55000000, fuelType: 'diesel', engineSize: 2.0 },
          { year: 2023, fiscalValue: 52000000, fuelType: 'diesel', engineSize: 2.0 },
        ]
      }
    }
  });

  // Renault
  await prisma.model.create({
    data: {
      name: 'Sandero',
      brandId: renault.id,
      type: 'hatchback',
      versions: {
        create: [
          { year: 2024, fiscalValue: 14000000, fuelType: 'nafta', engineSize: 1.6 },
          { year: 2023, fiscalValue: 12500000, fuelType: 'nafta', engineSize: 1.6 },
        ]
      }
    }
  });

  await prisma.model.create({
    data: {
      name: 'Duster',
      brandId: renault.id,
      type: 'suv',
      versions: {
        create: [
          { year: 2024, fiscalValue: 26000000, fuelType: 'nafta', engineSize: 1.6 },
          { year: 2023, fiscalValue: 24000000, fuelType: 'nafta', engineSize: 1.6 },
        ]
      }
    }
  });

  // Peugeot
  await prisma.model.create({
    data: {
      name: '208',
      brandId: peugeot.id,
      type: 'hatchback',
      versions: {
        create: [
          { year: 2024, fiscalValue: 20000000, fuelType: 'nafta', engineSize: 1.6 },
          { year: 2023, fiscalValue: 18500000, fuelType: 'nafta', engineSize: 1.6 },
        ]
      }
    }
  });

  await prisma.model.create({
    data: {
      name: '2008',
      brandId: peugeot.id,
      type: 'suv',
      versions: {
        create: [
          { year: 2024, fiscalValue: 27000000, fuelType: 'nafta', engineSize: 1.6 },
          { year: 2023, fiscalValue: 25000000, fuelType: 'nafta', engineSize: 1.6 },
        ]
      }
    }
  });

  console.log('✅ Models and versions created');

  // 3. COBERTURAS
  await prisma.coverage.create({
    data: {
      name: 'Responsabilidad Civil',
      description: 'Cobertura mínima obligatoria',
      type: 'RC',
      baseMultiplier: 1.0,
      features: JSON.stringify([
        'Daños a terceros',
        'Responsabilidad civil',
        'Defensa legal'
      ])
    }
  });

  const tercerosCompletos = await prisma.coverage.create({
    data: {
      name: 'Terceros Completos',
      description: 'Cobertura intermedia con protección adicional',
      type: 'Terceros_Completos',
      baseMultiplier: 1.5,
      features: JSON.stringify([
        'Todo lo de RC',
        'Incendio total',
        'Robo total',
        'Daños parciales por incendio',
        'Cristales laterales'
      ])
    }
  });

  const todoRiesgo = await prisma.coverage.create({
    data: {
      name: 'Todo Riesgo',
      description: 'Cobertura completa premium',
      type: 'Todo_Riesgo',
      baseMultiplier: 2.2,
      features: JSON.stringify([
        'Todo lo de Terceros Completos',
        'Daños propios por accidente',
        'Daños por granizo',
        'Cristales de todo tipo',
        'Cerraduras',
        'Auto sustituto',
        'Asistencia mecánica 24/7'
      ])
    }
  });

  console.log('✅ Coverages created');

  // 4. ADICIONALES
  await prisma.coverageAdditional.createMany({
    data: [
      {
        name: 'Granizo',
        description: 'Protección contra daños por granizo',
        price: 2500,
        coverageId: tercerosCompletos.id
      },
      {
        name: 'Cristales Premium',
        description: 'Cobertura total de cristales (parabrisas, luneta, espejos)',
        price: 1800,
        coverageId: tercerosCompletos.id
      },
      {
        name: 'Cerraduras y Llaves',
        description: 'Reposición de cerraduras y llaves',
        price: 1200,
        coverageId: tercerosCompletos.id
      },
      {
        name: 'Auto Sustituto Premium',
        description: 'Vehículo de reemplazo categoría superior',
        price: 3500,
        coverageId: todoRiesgo.id
      },
      {
        name: 'Cobertura Internacional',
        description: 'Extensión para Brasil, Uruguay, Chile, Paraguay',
        price: 4000
      },
      {
        name: 'Accesorios y Equipos',
        description: 'Cobertura para GNC, audio, alarma hasta $500.000',
        price: 1500
      }
    ]
  });

  console.log('✅ Coverage additionals created');

  // 5. ZONAS DE RIESGO (Códigos postales de Argentina)
  await prisma.riskZone.createMany({
    data: [
      // CABA - Alto riesgo
      { postalCode: 'C1001', city: 'CABA', province: 'Ciudad de Buenos Aires', riskLevel: 'muy_alto', factor: 1.4 },
      { postalCode: 'C1002', city: 'CABA', province: 'Ciudad de Buenos Aires', riskLevel: 'muy_alto', factor: 1.4 },
      { postalCode: 'C1003', city: 'CABA', province: 'Ciudad de Buenos Aires', riskLevel: 'muy_alto', factor: 1.4 },
      
      // GBA - Riesgo medio-alto
      { postalCode: 'B1602', city: 'Florida', province: 'Buenos Aires', riskLevel: 'alto', factor: 1.3 },
      { postalCode: 'B1636', city: 'Olivos', province: 'Buenos Aires', riskLevel: 'alto', factor: 1.3 },
      { postalCode: 'B1712', city: 'Castelar', province: 'Buenos Aires', riskLevel: 'alto', factor: 1.3 },
      { postalCode: 'B1878', city: 'Quilmes', province: 'Buenos Aires', riskLevel: 'alto', factor: 1.3 },
      
      // Interior Buenos Aires - Riesgo medio
      { postalCode: 'B7000', city: 'Tandil', province: 'Buenos Aires', riskLevel: 'medio', factor: 1.1 },
      { postalCode: 'B7600', city: 'Mar del Plata', province: 'Buenos Aires', riskLevel: 'medio', factor: 1.1 },
      { postalCode: 'B6700', city: 'Luján', province: 'Buenos Aires', riskLevel: 'medio', factor: 1.1 },
      
      // Córdoba
      { postalCode: 'X5000', city: 'Córdoba Capital', province: 'Córdoba', riskLevel: 'medio', factor: 1.15 },
      { postalCode: 'X5001', city: 'Córdoba Capital', province: 'Córdoba', riskLevel: 'medio', factor: 1.15 },
      
      // Rosario
      { postalCode: 'S2000', city: 'Rosario', province: 'Santa Fe', riskLevel: 'alto', factor: 1.25 },
      
      // Mendoza
      { postalCode: 'M5500', city: 'Mendoza Capital', province: 'Mendoza', riskLevel: 'medio', factor: 1.1 },
      
      // Interior - Riesgo bajo
      { postalCode: 'T4000', city: 'San Miguel de Tucumán', province: 'Tucumán', riskLevel: 'bajo', factor: 0.9 },
      { postalCode: 'U9000', city: 'Comodoro Rivadavia', province: 'Chubut', riskLevel: 'bajo', factor: 0.85 },
      { postalCode: 'A4400', city: 'Salta Capital', province: 'Salta', riskLevel: 'bajo', factor: 0.9 },
    ]
  });

  console.log('✅ Risk zones created');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });