import express from 'express';
import customerController from '../controllers/customerController.js';

const router = express.Router();

// Customer routes
router.post('/', customerController.create);
router.get('/', customerController.getAll);
router.get('/search', customerController.search);
router.get('/:id', customerController.getById);
router.put('/:id', customerController.update);
router.delete('/:id', customerController.delete);

// Phone routes
router.post('/:id/phones', customerController.addPhone);
router.put('/:id/phones/:phoneId/primary', customerController.setPrimaryPhone);
router.delete('/:id/phones/:phoneId', customerController.deletePhone);

export default router;
