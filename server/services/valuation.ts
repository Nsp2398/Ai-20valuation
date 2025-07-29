import { v4 as uuidv4 } from "uuid";
import {
  ValuationRequest,
  ValuationMethod,
  ValuationResult,
} from "@shared/api";
import { getDatabase } from "../database/init";

export class ValuationEngine {
  // Valuation methods configuration
  private static methods: ValuationMethod[] = [
    {
      name: "Berkus Method",
      confidence: 0.7,
      applicableStages: ["idea", "pre-revenue"],
      description: "Pre-revenue valuation based on five key success factors",
    },
    {
      name: "Scorecard Method",
      confidence: 0.8,
      applicableStages: ["pre-revenue", "early-revenue"],
      description: "Comparative analysis with similar funded companies",
    },
    {
      name: "Risk Factor Summation",
      confidence: 0.75,
      applicableStages: ["pre-revenue", "early-revenue", "growth"],
      description: "Adjusts pre-money valuation based on risk assessment",
    },
    {
      name: "VC Method",
      confidence: 0.85,
      applicableStages: ["early-revenue", "growth"],
      description: "Backward calculation from expected exit value",
    },
    {
      name: "DCF Analysis",
      confidence: 0.9,
      applicableStages: ["early-revenue", "growth"],
      description: "Discounted cash flow for revenue-generating businesses",
    },
    {
      name: "Comparable Analysis",
      confidence: 0.8,
      applicableStages: ["pre-revenue", "early-revenue", "growth"],
      description: "Market-based valuation using industry multiples",
    },
  ];

  static getApplicableMethods(stage: string): ValuationMethod[] {
    return this.methods.filter((method) =>
      method.applicableStages.includes(stage),
    );
  }

  static async calculateValuation(
    data: ValuationRequest,
    userId: string,
  ): Promise<ValuationResult> {
    const applicableMethods = this.getApplicableMethods(data.stage);
    const methodResults = [];

    // Calculate valuation for each applicable method
    for (const method of applicableMethods) {
      const value = await this.calculateMethodValue(method.name, data);
      const weight = this.calculateMethodWeight(method, data);

      methodResults.push({
        name: method.name,
        value,
        confidence: method.confidence,
        weight,
      });
    }

    // Calculate weighted average valuation
    const totalWeight = methodResults.reduce(
      (sum, result) => sum + result.weight,
      0,
    );
    const weightedValuation =
      methodResults.reduce(
        (sum, result) => sum + result.value * result.weight,
        0,
      ) / totalWeight;

    // Add variance for min/max range
    const variance = 0.25; // 25% variance
    const minValuation = weightedValuation * (1 - variance);
    const maxValuation = weightedValuation * (1 + variance);

    // Determine primary method (highest weighted confidence)
    const primaryMethod = methodResults.reduce((best, current) =>
      current.confidence * current.weight > best.confidence * best.weight
        ? current
        : best,
    );

    // Calculate overall confidence
    const overallConfidence =
      methodResults.reduce(
        (sum, result) => sum + result.confidence * result.weight,
        0,
      ) / totalWeight;

    const valuationId = uuidv4();
    const result: ValuationResult = {
      id: valuationId,
      userId,
      companyName: data.companyName,
      estimatedValuation: {
        min: Math.round(minValuation),
        max: Math.round(maxValuation),
        primary: Math.round(weightedValuation),
      },
      methods: methodResults,
      primaryMethod: primaryMethod.name,
      confidence: Math.round(overallConfidence * 100) / 100,
      createdAt: new Date().toISOString(),
    };

    // Store in database
    await this.saveValuationToDatabase(result, data);

    return result;
  }

  private static async calculateMethodValue(
    methodName: string,
    data: ValuationRequest,
  ): Promise<number> {
    switch (methodName) {
      case "Berkus Method":
        return this.berkusMethod(data);

      case "Scorecard Method":
        return this.scorecardMethod(data);

      case "Risk Factor Summation":
        return this.riskFactorMethod(data);

      case "VC Method":
        return this.vcMethod(data);

      case "DCF Analysis":
        return this.dcfMethod(data);

      case "Comparable Analysis":
        return this.comparableMethod(data);

      default:
        return 1000000; // Default $1M
    }
  }

  private static berkusMethod(data: ValuationRequest): number {
    // Berkus Method: Up to $500K for each of 5 elements
    let valuation = 0;

    // Sound idea (basic value)
    valuation += 500000;

    // Prototype (reduces technology risk)
    if (data.stage !== "idea") valuation += 500000;

    // Quality management team
    if (data.teamSize >= 3) valuation += 500000;

    // Strategic relationships
    if (data.industry === "technology" || data.industry === "saas")
      valuation += 250000;

    // Product rollout or sales
    if (data.revenue && data.revenue > 0) valuation += 500000;

    return Math.min(valuation, 2500000); // Max $2.5M
  }

  private static scorecardMethod(data: ValuationRequest): number {
    // Start with regional average (estimated)
    let baseValuation = 2000000; // $2M base

    // Industry multipliers
    const industryMultipliers: Record<string, number> = {
      technology: 1.3,
      saas: 1.4,
      healthcare: 1.2,
      fintech: 1.35,
      biotech: 1.5,
      ecommerce: 1.1,
    };

    baseValuation *= industryMultipliers[data.industry] || 1.0;

    // Team quality adjustment
    if (data.teamSize >= 5) baseValuation *= 1.2;
    else if (data.teamSize >= 3) baseValuation *= 1.1;

    // Market opportunity
    const marketValue = this.parseMarketSize(data.marketSize);
    if (marketValue > 10000000000)
      baseValuation *= 1.3; // $10B+ market
    else if (marketValue > 1000000000) baseValuation *= 1.2; // $1B+ market

    // Revenue traction
    if (data.revenue && data.revenue > 100000) baseValuation *= 1.4;
    else if (data.revenue && data.revenue > 10000) baseValuation *= 1.2;

    return baseValuation;
  }

  private static riskFactorMethod(data: ValuationRequest): number {
    let baseValuation = this.scorecardMethod(data);
    let riskAdjustment = 0;

    // Risk factors (each adds/subtracts to risk)
    const risks = [
      { factor: "Management", adjustment: data.teamSize >= 3 ? 0 : 1 },
      {
        factor: "Stage of business",
        adjustment:
          data.stage === "growth" ? -1 : data.stage === "idea" ? 2 : 0,
      },
      { factor: "Legislation/Political", adjustment: 0 }, // Neutral
      {
        factor: "Manufacturing",
        adjustment: data.industry === "technology" ? -1 : 0,
      },
      { factor: "Sales channels", adjustment: data.revenue ? -1 : 1 },
      {
        factor: "Funding/Capital",
        adjustment: data.fundingGoal > 5000000 ? 1 : 0,
      },
      { factor: "Competition", adjustment: 1 }, // Assume competitive market
      {
        factor: "Technology",
        adjustment: data.industry === "technology" ? -1 : 0,
      },
      { factor: "Litigation", adjustment: 0 }, // Neutral
      {
        factor: "International",
        adjustment: data.geographicMarket === "global" ? 1 : 0,
      },
      { factor: "Reputation", adjustment: 0 }, // Neutral
      {
        factor: "Lucidity/Focus",
        adjustment: data.description.length > 200 ? -1 : 0,
      },
    ];

    riskAdjustment = risks.reduce((sum, risk) => sum + risk.adjustment, 0);

    // Each risk factor adjusts valuation by ±$250K
    const adjustmentAmount = riskAdjustment * 250000;

    return Math.max(baseValuation - adjustmentAmount, 500000); // Minimum $500K
  }

  private static vcMethod(data: ValuationRequest): number {
    // VC Method: Terminal Value / Expected Return - Investment
    const projectedRevenue = data.projectedRevenue || data.revenue! * 10; // 10x growth assumption
    const industryMultiple = this.getIndustryMultiple(data.industry);
    const terminalValue = projectedRevenue * industryMultiple;

    // Expected return (10x for early stage, 5x for growth)
    const expectedReturn = data.stage === "early-revenue" ? 10 : 5;

    // Current valuation
    const postMoneyValuation = terminalValue / expectedReturn;
    const preMoneyValuation = postMoneyValuation - data.fundingGoal;

    return Math.max(preMoneyValuation, 500000);
  }

  private static dcfMethod(data: ValuationRequest): number {
    if (!data.revenue) return this.scorecardMethod(data);

    // DCF assumptions
    const growthRate = 0.3; // 30% annual growth
    const terminalGrowthRate = 0.03; // 3% terminal growth
    const discountRate = 0.12; // 12% WACC
    const projectionYears = 5;

    let cashFlows = [];
    let currentRevenue = data.revenue;

    // Project cash flows
    for (let year = 1; year <= projectionYears; year++) {
      currentRevenue *= 1 + growthRate;
      const expenses = data.expenses || currentRevenue * 0.7; // 30% margin assumption
      const cashFlow = currentRevenue - expenses;
      const presentValue = cashFlow / Math.pow(1 + discountRate, year);
      cashFlows.push(presentValue);
    }

    // Terminal value
    const terminalCashFlow = currentRevenue * (1 + terminalGrowthRate) * 0.3; // 30% margin
    const terminalValue =
      terminalCashFlow / (discountRate - terminalGrowthRate);
    const presentTerminalValue =
      terminalValue / Math.pow(1 + discountRate, projectionYears);

    const totalValue =
      cashFlows.reduce((sum, cf) => sum + cf, 0) + presentTerminalValue;

    return Math.max(totalValue, 500000);
  }

  private static comparableMethod(data: ValuationRequest): number {
    const marketValue = this.parseMarketSize(data.marketSize);
    const industryMultiple = this.getIndustryMultiple(data.industry);

    // Base on revenue multiple or market penetration
    if (data.revenue && data.revenue > 0) {
      return data.revenue * industryMultiple;
    } else {
      // For pre-revenue, estimate based on market opportunity and stage
      const marketPenetration =
        data.stage === "growth"
          ? 0.001
          : data.stage === "early-revenue"
            ? 0.0005
            : 0.0001;

      return marketValue * marketPenetration;
    }
  }

  private static calculateMethodWeight(
    method: ValuationMethod,
    data: ValuationRequest,
  ): number {
    let weight = 1.0;

    // Adjust weight based on data availability and method suitability
    switch (method.name) {
      case "DCF Analysis":
        weight = data.revenue && data.revenue > 100000 ? 1.5 : 0.5;
        break;
      case "VC Method":
        weight = data.projectedRevenue ? 1.3 : 0.8;
        break;
      case "Berkus Method":
        weight = data.stage === "idea" ? 1.5 : 0.7;
        break;
      case "Scorecard Method":
        weight = data.teamSize >= 3 ? 1.2 : 1.0;
        break;
    }

    return weight * method.confidence;
  }

  private static getIndustryMultiple(industry: string): number {
    const multiples: Record<string, number> = {
      technology: 8,
      saas: 10,
      healthcare: 6,
      fintech: 9,
      biotech: 15,
      ecommerce: 4,
      other: 5,
    };

    return multiples[industry] || multiples["other"];
  }

  private static parseMarketSize(marketSize: string): number {
    const cleanSize = marketSize.replace(/[^\d.]/g, "");
    const value = parseFloat(cleanSize);

    if (marketSize.toLowerCase().includes("b")) {
      return value * 1000000000; // Billion
    } else if (marketSize.toLowerCase().includes("m")) {
      return value * 1000000; // Million
    } else if (marketSize.toLowerCase().includes("k")) {
      return value * 1000; // Thousand
    }

    return value || 1000000000; // Default $1B
  }

  private static async saveValuationToDatabase(
    result: ValuationResult,
    data: ValuationRequest,
  ): Promise<void> {
    const db = getDatabase();

    await db.run(
      `
      INSERT INTO valuations (
        id, user_id, company_name, industry, stage, description,
        revenue, expenses, team_size, market_size, funding_goal,
        business_model, projected_revenue, burn_rate, runway,
        previous_funding, geographic_market, competition, use_of_funds,
        estimated_valuation_min, estimated_valuation_max, estimated_valuation_primary,
        primary_method, confidence, methods_data, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        result.id,
        result.userId,
        data.companyName,
        data.industry,
        data.stage,
        data.description,
        data.revenue,
        data.expenses,
        data.teamSize,
        data.marketSize,
        data.fundingGoal,
        data.businessModel,
        data.projectedRevenue,
        data.burnRate,
        data.runway,
        data.previousFunding,
        data.geographicMarket,
        data.competition,
        data.useOfFunds,
        result.estimatedValuation.min,
        result.estimatedValuation.max,
        result.estimatedValuation.primary,
        result.primaryMethod,
        result.confidence,
        JSON.stringify(result.methods),
        result.createdAt,
      ],
    );
  }

  static async getUserValuations(userId: string): Promise<ValuationResult[]> {
    const db = getDatabase();

    const valuations = await db.all(
      `
      SELECT * FROM valuations 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `,
      [userId],
    );

    return valuations.map((v) => ({
      id: v.id,
      userId: v.user_id,
      companyName: v.company_name,
      estimatedValuation: {
        min: v.estimated_valuation_min,
        max: v.estimated_valuation_max,
        primary: v.estimated_valuation_primary,
      },
      methods: JSON.parse(v.methods_data),
      primaryMethod: v.primary_method,
      confidence: v.confidence,
      createdAt: v.created_at,
      reportUrl: v.report_url,
    }));
  }

  static async getValuationById(
    id: string,
    userId: string,
  ): Promise<ValuationResult | null> {
    const db = getDatabase();

    const valuation = await db.get(
      `
      SELECT * FROM valuations 
      WHERE id = ? AND user_id = ?
    `,
      [id, userId],
    );

    if (!valuation) return null;

    return {
      id: valuation.id,
      userId: valuation.user_id,
      companyName: valuation.company_name,
      estimatedValuation: {
        min: valuation.estimated_valuation_min,
        max: valuation.estimated_valuation_max,
        primary: valuation.estimated_valuation_primary,
      },
      methods: JSON.parse(valuation.methods_data),
      primaryMethod: valuation.primary_method,
      confidence: valuation.confidence,
      createdAt: valuation.created_at,
      reportUrl: valuation.report_url,
    };
  }
}
