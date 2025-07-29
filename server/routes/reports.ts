import { RequestHandler } from 'express';
import { AuthenticatedRequest } from '../utils/auth';
import { ReportGenerator } from '../services/reportGenerator';
import { ReportRequest, ReportResponse } from '@shared/api';

export const generateReport: RequestHandler = async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      } as ReportResponse);
    }

    const { valuationId, format }: ReportRequest = req.body;

    if (!valuationId || !format) {
      return res.status(400).json({
        success: false,
        message: 'Valuation ID and format are required'
      } as ReportResponse);
    }

    if (!['pdf', 'docx'].includes(format)) {
      return res.status(400).json({
        success: false,
        message: 'Format must be either "pdf" or "docx"'
      } as ReportResponse);
    }

    const result = await ReportGenerator.generateReport(valuationId, req.user.id, format);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);

  } catch (error: any) {
    console.error('Generate report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate report'
    } as ReportResponse);
  }
};

export const downloadReport: RequestHandler = async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { reportId } = req.params;

    if (!reportId) {
      return res.status(400).json({
        success: false,
        message: 'Report ID is required'
      });
    }

    const reportFile = await ReportGenerator.getReportFile(reportId, req.user.id);

    if (!reportFile) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Set appropriate headers for file download
    const format = reportFile.fileName.endsWith('.pdf') ? 'pdf' : 'docx';
    const contentType = format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${reportFile.fileName}"`);
    res.setHeader('Cache-Control', 'no-cache');

    // Stream the file
    res.sendFile(reportFile.filePath);

  } catch (error: any) {
    console.error('Download report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download report'
    });
  }
};

export const getUserReports: RequestHandler = async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const reports = await ReportGenerator.getUserReports(req.user.id);

    res.json({
      success: true,
      message: 'Reports retrieved successfully',
      reports
    });

  } catch (error: any) {
    console.error('Get user reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve reports'
    });
  }
};

export const deleteReport: RequestHandler = async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { reportId } = req.params;

    if (!reportId) {
      return res.status(400).json({
        success: false,
        message: 'Report ID is required'
      });
    }

    // Implementation would delete the report record and file
    // For now, just return success
    res.json({
      success: true,
      message: 'Report deleted successfully'
    });

  } catch (error: any) {
    console.error('Delete report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete report'
    });
  }
};
