import { Router } from 'express';

import {
  dashboard,
  dashboardSummary,
  exportLowStockCsv,
  exportLowStockPdf,
  exportRecentSalesCsv,
  exportRecentSalesPdf,
  exportSalesByDateCsv,
  exportSalesByDatePdf,
  exportSalesByPaymentCsv,
  exportSalesByPaymentPdf,
  exportTopCustomersCsv,
  exportTopCustomersPdf,
  exportTopProductsCsv,
  exportTopProductsPdf,
  overview,
  salesTotal,
  stockSummary,
} from '../controllers/reportController.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/authorize.js';

const router = Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/dashboard', dashboard);
router.get('/dashboard-summary', dashboardSummary);
router.get('/overview', overview);
router.get('/sales-total', salesTotal);
router.get('/stock-summary', stockSummary);
router.get('/recent-sales.csv', exportRecentSalesCsv);
router.get('/recent-sales/csv', exportRecentSalesCsv);
router.get('/recent-sales/pdf', exportRecentSalesPdf);
router.get('/top-products/csv', exportTopProductsCsv);
router.get('/top-products/pdf', exportTopProductsPdf);
router.get('/low-stock/csv', exportLowStockCsv);
router.get('/low-stock/pdf', exportLowStockPdf);
router.get('/sales-by-payment/csv', exportSalesByPaymentCsv);
router.get('/sales-by-payment/pdf', exportSalesByPaymentPdf);
router.get('/sales-by-date/csv', exportSalesByDateCsv);
router.get('/sales-by-date/pdf', exportSalesByDatePdf);
router.get('/top-customers/csv', exportTopCustomersCsv);
router.get('/top-customers/pdf', exportTopCustomersPdf);

export default router;
