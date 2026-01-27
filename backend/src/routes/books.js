import express from 'express';
import bookController from '../controllers/bookController.js';

const router = express.Router();

// Book routes
router.post('/', bookController.create);
router.get('/', bookController.getAll);
router.get('/current', bookController.getCurrent);
router.get('/:id', bookController.getById);
router.get('/:id/next-folio', bookController.getNextFolio);
router.get('/:id/check-folio', bookController.checkFolio);
router.put('/:id', bookController.update);
router.put('/:id/set-current', bookController.setCurrent);
router.delete('/:id', bookController.delete);

export default router;
