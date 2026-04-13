// src/services/quote.service.ts
import { PrismaClient } from '@prisma/client';
import { QuoteCalculationInput, RiskFactors, /*PremiumCalculation*/ } from '../types';
import { AppError } from '../middlewares/errorHandler';

const prisma = new PrismaClient();

export class QuoteService {
  
  /**
   * Calcula el factor de edad del conductor
   */
  private calculateAgeFactor(dateOfBirth: Date): number {
    const age = this.calculateAge(dateOfBirth);
    
    if (age < 18) throw new AppError(400, 'Driver must be at least 18 years old');
    if (age >= 18 && age <= 25) return 1.5;   // +50%
    if (age >= 26 && age <= 35) return 1.2;   // +20%
    if (age >= 36 && age <= 60) return 1.0;   // Base
    if (age > 60) return 1.15;                // +15%
    
    return 1.0;
  }

  /**
   * Calcula el factor de antigüedad del vehículo
   */
  private calculateVehicleAgeFactor(year: number): number {
    const currentYear = new Date().getFullYear();
    const vehicleAge = currentYear - year;
    
    if (vehicleAge <= 3) return 1.0;          // Base
    if (vehicleAge <= 10) return 1.3;         // +30%
    return 1.5;                                // +50%
  }

  /**
   * Obtiene el factor de zona según código postal
   */
  private async getZoneFactor(postalCode: string): Promise<number> {
    const zone = await prisma.riskZone.findUnique({
      where: { postalCode }
    });
    
    return zone?.factor || 1.2; // Default: riesgo medio
  }

  /**
   * Calcula el factor de uso del vehículo
   */
  private calculateUsageFactor(usage: string): number {
    const factors: Record<string, number> = {
      particular: 1.0,   // Base
      comercial: 1.4,    // +40%
      rideshare: 1.6     // +60%
    };
    
    return factors[usage] || 1.0;
  }

  /**
   * Calcula el factor de género (basado en estadísticas actuariales)
   */
  private calculateGenderFactor(gender: string, age: number): number {
    // Hombres jóvenes tienen mayor riesgo estadístico
    if (gender === 'M' && age < 26) return 1.15;  // +15%
    if (gender === 'M' && age < 35) return 1.05;  // +5%
    
    return 1.0; // Base para otros casos
  }

  /**
   * Calcula el factor de historial de siniestros
   */
  private async calculateClaimsHistoryFactor(customerId: string): Promise<{ factor: number; count: number }> {
    const threeYearsAgo = new Date();
    threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
    
    const claimsCount = await prisma.claim.count({
      where: {
        customerId,
        claimDate: {
          gte: threeYearsAgo
        }
      }
    });
    
    if (claimsCount === 0) return { factor: 0.8, count: 0 };   // -20% sin siniestros
    if (claimsCount === 1) return { factor: 1.3, count: 1 };   // +30% un siniestro
    if (claimsCount === 2) return { factor: 1.6, count: 2 };   // +60% dos siniestros
    return { factor: 2.0, count: claimsCount };                // +100% tres o más
  }

  /**
   * Calcula la prima base según el valor del vehículo
   */
  private calculateBasePremium(insuredValue: number, coverageMultiplier: number): number {
    // Prima base: 3-5% del valor asegurado anual, dividido en 12 meses
    const annualRate = 0.04; // 4% promedio
    const annualPremium = insuredValue * annualRate * coverageMultiplier;
    return annualPremium / 12; // Retorna mensual
  }

  /**
   * Calcula el costo de adicionales
   */
  private async calculateAdditionalsCost(additionalIds: string[]): Promise<number> {
    if (!additionalIds || additionalIds.length === 0) return 0;
    
    const additionals = await prisma.coverageAdditional.findMany({
      where: {
        id: { in: additionalIds },
        active: true
      }
    });
    
    return additionals.reduce((sum: number, add: { price: number }) => sum + add.price, 0);
  }

  /**
   * Calcula la edad de una persona
   */
  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Genera un número de cotización único
   */
  private async generateQuoteNumber(): Promise<string> {
    const prefix = 'QT';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
  }

  /**
   * Calcula una cotización completa
   */
  async calculateQuote(input: QuoteCalculationInput): Promise<any> {
    // 1. Validar que existan todos los registros necesarios
    const [customer, version, coverage] = await Promise.all([
      prisma.customer.findUnique({ where: { id: input.customerId } }),
      prisma.version.findUnique({
        where: { id: input.versionId },
        include: {
          model: {
            include: { brand: true }
          }
        }
      }),
      prisma.coverage.findUnique({
        where: { id: input.coverageId },
        include: { additionals: true }
      })
    ]);

    if (!customer) throw new AppError(404, 'Customer not found');
    if (!version) throw new AppError(404, 'Vehicle version not found');
    if (!coverage) throw new AppError(404, 'Coverage not found');

    // 2. Calcular todos los factores de riesgo
    const age = this.calculateAge(customer.dateOfBirth);
    const claimsHistory = await this.calculateClaimsHistoryFactor(customer.id);
    
    const factors: RiskFactors = {
      ageFactor: this.calculateAgeFactor(customer.dateOfBirth),
      vehicleAgeFactor: this.calculateVehicleAgeFactor(version.year),
      zoneFactor: await this.getZoneFactor(customer.postalCode),
      usageFactor: this.calculateUsageFactor(input.vehicleUsage),
      genderFactor: this.calculateGenderFactor(customer.gender, age),
      claimsHistoryFactor: claimsHistory.factor
    };

    // 3. Calcular prima base
    const basePremium = this.calculateBasePremium(
      input.insuredValue,
      coverage.baseMultiplier
    );

    // 4. Calcular prima con riesgos
    const riskMultiplier = Object.values(factors).reduce((acc, factor) => acc * factor, 1);
    const riskPremium = basePremium * riskMultiplier;

    // 5. Calcular adicionales
    const additionalsCost = await this.calculateAdditionalsCost(
      input.selectedAdditionals || []
    );

    // 6. Calcular totales
    const totalMonthly = riskPremium + additionalsCost;
    const totalAnnual = totalMonthly * 12;

    // 7. Crear la cotización
    const quoteNumber = await this.generateQuoteNumber();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // Válida por 30 días

    const quote = await prisma.quote.create({
      data: {
        quoteNumber,
        customerId: customer.id,
        versionId: version.id,
        coverageId: coverage.id,
        vehiclePlate: input.vehiclePlate,
        vehicleUsage: input.vehicleUsage,
        insuredValue: input.insuredValue,
        agefactor: factors.ageFactor,
        vehicleAgeFactor: factors.vehicleAgeFactor,
        zoneFactor: factors.zoneFactor,
        usageFactor: factors.usageFactor,
        genderFactor: factors.genderFactor,
        claimsHistoryFactor: factors.claimsHistoryFactor,
        basePremium,
        riskPremium,
        additionalsCost,
        totalMonthly,
        totalAnnual,
        selectedAdditionals: JSON.stringify(input.selectedAdditionals || []),
        claimsLast3Years: claimsHistory.count,
        expiresAt
      },
      include: {
        customer: true,
        version: {
          include: {
            model: {
              include: { brand: true }
            }
          }
        },
        coverage: {
          include: { additionals: true }
        }
      }
    });

    // 8. Registrar en audit log
    await prisma.auditLog.create({
      data: {
        action: 'quote_created',
        entityType: 'quote',
        entityId: quote.id,
        details: JSON.stringify({
          quoteNumber,
          totalMonthly,
          totalAnnual
        })
      }
    });

    return {
      ...quote,
      factors,
      breakdown: {
        basePremium,
        riskPremium,
        additionalsCost,
        totalMonthly,
        totalAnnual
      }
    };
  }

  /**
   * Obtiene una cotización por ID
   */
  async getQuoteById(id: string): Promise<any> {
    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        customer: true,
        version: {
          include: {
            model: {
              include: { brand: true }
            }
          }
        },
        coverage: {
          include: { additionals: true }
        }
      }
    });

    if (!quote) throw new AppError(404, 'Quote not found');

    // Registrar visualización
    await prisma.auditLog.create({
      data: {
        action: 'quote_viewed',
        entityType: 'quote',
        entityId: quote.id
      }
    });

    return quote;
  }

  /**
   * Lista cotizaciones con filtros
   */
  async listQuotes(filters: {
    customerId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<any> {
    const { customerId, status, page = 1, limit = 10 } = filters;
    
    const where: any = {};
    if (customerId) where.customerId = customerId;
    if (status) where.status = status;

    const [quotes, total] = await Promise.all([
      prisma.quote.findMany({
        where,
        include: {
          customer: true,
          version: {
            include: {
              model: {
                include: { brand: true }
              }
            }
          },
          coverage: true
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.quote.count({ where })
    ]);

    return {
      quotes,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}

export default new QuoteService();