import BillModel from '../models/Bill.js';
import path from 'path';
import fs from 'fs/promises';

export const billController = {
  // Create new bill
  async create(req, res) {
    try {
      const {
        bookId,
        customerId,
        folioNumber,
        billDate,
        deliveryDate,
        totalAmount,
        advancePaid,
        status,
        remarks
      } = req.body;

      const createdBy = req.user?.id;

      // Validate required fields
      if (!bookId || !customerId || !folioNumber) {
        return res.status(400).json({
          success: false,
          error: 'Book ID, Customer ID, and Folio Number are required'
        });
      }

      // Handle file upload
      let imageUrl = null;
      let thumbnailUrl = null;

      if (req.files) {
        if (req.files.image) {
          imageUrl = req.files.image[0].path;
        }
        if (req.files.thumbnail) {
          thumbnailUrl = req.files.thumbnail[0].path;
        }
      }

      const bill = await BillModel.create({
        bookId,
        customerId,
        folioNumber: parseInt(folioNumber),
        imageUrl,
        thumbnailUrl,
        billDate,
        deliveryDate,
        totalAmount: totalAmount ? parseFloat(totalAmount) : null,
        advancePaid: advancePaid ? parseFloat(advancePaid) : null,
        status,
        remarks,
        createdBy
      });

      // Fetch complete bill data
      const completeBill = await BillModel.findById(bill.id);

      res.status(201).json({
        success: true,
        data: completeBill
      });
    } catch (error) {
      console.error('Error creating bill:', error);

      // Check for unique constraint violation
      if (error.code === '23505') {
        return res.status(409).json({
          success: false,
          error: 'Folio number already exists in this book'
        });
      }

      res.status(500).json({
        success: false,
        error: error.message || 'Failed to create bill'
      });
    }
  },

  // Get bill by ID
  async getById(req, res) {
    try {
      const { id } = req.params;

      const bill = await BillModel.findById(id);

      if (!bill) {
        return res.status(404).json({
          success: false,
          error: 'Bill not found'
        });
      }

      res.json({
        success: true,
        data: bill
      });
    } catch (error) {
      console.error('Error getting bill:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get bill'
      });
    }
  },

  // Search bills by folio
  async searchByFolio(req, res) {
    try {
      const { folio } = req.params;
      const { bookId } = req.query;

      const bills = await BillModel.findByFolio(parseInt(folio), bookId);

      res.json({
        success: true,
        data: bills
      });
    } catch (error) {
      console.error('Error searching bills:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to search bills'
      });
    }
  },

  // Get bills by customer
  async getByCustomer(req, res) {
    try {
      const { customerId } = req.params;

      const bills = await BillModel.findByCustomerId(customerId);

      res.json({
        success: true,
        data: bills
      });
    } catch (error) {
      console.error('Error getting customer bills:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get bills'
      });
    }
  },

  // Get all bills with filters
  async getAll(req, res) {
    try {
      const {
        bookId,
        status,
        fromDate,
        toDate,
        limit = 50,
        offset = 0
      } = req.query;

      const bills = await BillModel.findAll({
        bookId,
        status,
        fromDate,
        toDate,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.json({
        success: true,
        data: bills
      });
    } catch (error) {
      console.error('Error getting bills:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get bills'
      });
    }
  },

  // Get due deliveries
  async getDueDeliveries(req, res) {
    try {
      const { date } = req.query;
      const deliveryDate = date ? new Date(date) : new Date();

      const bills = await BillModel.findDueForDelivery(deliveryDate);

      res.json({
        success: true,
        data: bills
      });
    } catch (error) {
      console.error('Error getting due deliveries:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get due deliveries'
      });
    }
  },

  // Get pending payments
  async getPendingPayments(req, res) {
    try {
      const bills = await BillModel.findPendingPayments();

      res.json({
        success: true,
        data: bills
      });
    } catch (error) {
      console.error('Error getting pending payments:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get pending payments'
      });
    }
  },

  // Get upcoming deliveries (within X days)
  async getUpcomingDeliveries(req, res) {
    try {
      const { days = 3 } = req.query;
      const bills = await BillModel.findUpcomingDeliveries(parseInt(days));

      res.json({
        success: true,
        data: bills
      });
    } catch (error) {
      console.error('Error getting upcoming deliveries:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get upcoming deliveries'
      });
    }
  },

  // Update bill
  async update(req, res) {
    try {
      const { id } = req.params;
      const {
        billDate,
        deliveryDate,
        actualDeliveryDate,
        totalAmount,
        advancePaid,
        status,
        remarks,
        extractionStatus,
        rawExtraction
      } = req.body;

      const updatedBy = req.user?.id;

      const bill = await BillModel.update(id, {
        billDate,
        deliveryDate,
        actualDeliveryDate,
        totalAmount: totalAmount ? parseFloat(totalAmount) : undefined,
        advancePaid: advancePaid ? parseFloat(advancePaid) : undefined,
        status,
        remarks,
        extractionStatus,
        rawExtraction,
        updatedBy
      });

      if (!bill) {
        return res.status(404).json({
          success: false,
          error: 'Bill not found'
        });
      }

      // Get complete bill data
      const completeBill = await BillModel.findById(id);

      res.json({
        success: true,
        data: completeBill
      });
    } catch (error) {
      console.error('Error updating bill:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update bill'
      });
    }
  },

  // Delete bill
  async delete(req, res) {
    try {
      const { id } = req.params;
      const updatedBy = req.user?.id;

      const bill = await BillModel.softDelete(id, updatedBy);

      if (!bill) {
        return res.status(404).json({
          success: false,
          error: 'Bill not found'
        });
      }

      res.json({
        success: true,
        data: bill
      });
    } catch (error) {
      console.error('Error deleting bill:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete bill'
      });
    }
  },

  // Get statistics
  async getStats(req, res) {
    try {
      const { bookId } = req.query;

      const stats = await BillModel.getStats(bookId);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get statistics'
      });
    }
  }
};

export default billController;
