import { RequestHandler } from 'express';
import { AuthenticatedRequest } from '../utils/auth';
import { ValuationEngine } from '../services/valuation';
import { 
  ValuationRequest, 
  ValuationResponse, 
  DashboardResponse,
  DashboardData 
} from '@shared/api';
import { getDatabase } from '../database/init';

export const createValuation: RequestHandler = async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      } as ValuationResponse);
    }

    const data: ValuationRequest = req.body;

    // Validate required fields
    const requiredFields = ['companyName', 'industry', 'stage', 'description', 'teamSize', 'marketSize', 'fundingGoal'];
    const missingFields = requiredFields.filter(field => !data[field as keyof ValuationRequest]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      } as ValuationResponse);
    }

    // Validate data types and ranges
    if (typeof data.teamSize !== 'number' || data.teamSize < 1) {
      return res.status(400).json({
        success: false,
        message: 'Team size must be a positive number'
      } as ValuationResponse);
    }

    if (typeof data.fundingGoal !== 'number' || data.fundingGoal < 1000) {
      return res.status(400).json({
        success: false,
        message: 'Funding goal must be at least $1,000'
      } as ValuationResponse);
    }

    // Get recommended methods before calculation
    const recommendedMethods = ValuationEngine.getApplicableMethods(data.stage);

    // Calculate valuation
    const result = await ValuationEngine.calculateValuation(data, req.user.id);

    res.status(201).json({
      success: true,
      message: 'Valuation calculated successfully',
      result,
      recommendedMethods
    } as ValuationResponse);

  } catch (error: any) {
    console.error('Create valuation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate valuation'
    } as ValuationResponse);
  }
};

export const getValuationMethods: RequestHandler = async (req, res) => {
  try {
    const { stage } = req.query;

    if (!stage || typeof stage !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Business stage is required'
      } as ValuationResponse);
    }

    const recommendedMethods = ValuationEngine.getApplicableMethods(stage);

    res.json({
      success: true,
      message: 'Valuation methods retrieved successfully',
      recommendedMethods
    } as ValuationResponse);

  } catch (error: any) {
    console.error('Get valuation methods error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve valuation methods'
    } as ValuationResponse);
  }
};

export const getUserValuations: RequestHandler = async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      } as ValuationResponse);
    }

    const valuations = await ValuationEngine.getUserValuations(req.user.id);

    res.json({
      success: true,
      message: 'Valuations retrieved successfully',
      result: valuations.length > 0 ? valuations[0] : undefined // For compatibility, return the latest
    } as ValuationResponse);

  } catch (error: any) {
    console.error('Get user valuations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve valuations'
    } as ValuationResponse);
  }
};

export const getValuationById: RequestHandler = async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      } as ValuationResponse);
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Valuation ID is required'
      } as ValuationResponse);
    }

    const valuation = await ValuationEngine.getValuationById(id, req.user.id);

    if (!valuation) {
      return res.status(404).json({
        success: false,
        message: 'Valuation not found'
      } as ValuationResponse);
    }

    res.json({
      success: true,
      message: 'Valuation retrieved successfully',
      result: valuation
    } as ValuationResponse);

  } catch (error: any) {
    console.error('Get valuation by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve valuation'
    } as ValuationResponse);
  }
};

export const getDashboard: RequestHandler = async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      } as DashboardResponse);
    }

    const db = getDatabase();

    // Get user info
    const user = {
      id: req.user.id,
      email: req.user.email,
      phone: req.user.phone,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Get user's valuations
    const recentValuations = await ValuationEngine.getUserValuations(req.user.id);
    const totalValuations = recentValuations.length;

    // Calculate average valuation
    const averageValuation = totalValuations > 0 
      ? recentValuations.reduce((sum, v) => sum + v.estimatedValuation.primary, 0) / totalValuations
      : 0;

    // Calculate portfolio growth (mock calculation)
    const portfolioGrowth = totalValuations > 1 
      ? ((recentValuations[0].estimatedValuation.primary - recentValuations[recentValuations.length - 1].estimatedValuation.primary) 
         / recentValuations[recentValuations.length - 1].estimatedValuation.primary) * 100
      : 0;

    const dashboardData: DashboardData = {
      user,
      recentValuations: recentValuations.slice(0, 5), // Last 5 valuations
      totalValuations,
      averageValuation: Math.round(averageValuation),
      portfolioGrowth: Math.round(portfolioGrowth * 100) / 100
    };

    res.json({
      success: true,
      data: dashboardData,
      message: 'Dashboard data retrieved successfully'
    } as DashboardResponse);

  } catch (error: any) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard data'
    } as DashboardResponse);
  }
};

export const deleteValuation: RequestHandler = async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      } as ValuationResponse);
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Valuation ID is required'
      } as ValuationResponse);
    }

    const db = getDatabase();

    // Verify the valuation belongs to the user
    const valuation = await db.get(`
      SELECT id FROM valuations WHERE id = ? AND user_id = ?
    `, [id, req.user.id]);

    if (!valuation) {
      return res.status(404).json({
        success: false,
        message: 'Valuation not found'
      } as ValuationResponse);
    }

    // Delete the valuation
    await db.run(`DELETE FROM valuations WHERE id = ?`, [id]);

    // Also delete any associated reports
    await db.run(`DELETE FROM reports WHERE valuation_id = ?`, [id]);

    res.json({
      success: true,
      message: 'Valuation deleted successfully'
    } as ValuationResponse);

  } catch (error: any) {
    console.error('Delete valuation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete valuation'
    } as ValuationResponse);
  }
};
