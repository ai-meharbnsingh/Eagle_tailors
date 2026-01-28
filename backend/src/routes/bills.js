import express from 'express';
import billController from '../controllers/billController.js';
import { upload, processBillImage } from '../middleware/upload.js';

const router = express.Router();

// Bill routes
router.post('/', upload.single('image'), processBillImage, billController.create);
router.get('/', billController.getAll);
router.get('/stats', billController.getStats);
router.get('/due-deliveries', billController.getDueDeliveries);
router.get('/upcoming-deliveries', billController.getUpcomingDeliveries);
router.get('/pending-payments', billController.getPendingPayments);
router.get('/folio/:folio', billController.searchByFolio);
router.get('/customer/:customerId', billController.getByCustomer);
router.get('/:id', billController.getById);
router.put('/:id', billController.update);
router.delete('/:id', billController.delete);

export default router;
