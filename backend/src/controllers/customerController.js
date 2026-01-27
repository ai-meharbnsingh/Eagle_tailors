import CustomerModel from '../models/Customer.js';
import PhoneModel from '../models/Phone.js';

export const customerController = {
  // Create new customer
  async create(req, res) {
    try {
      const { name, address, notes, phones } = req.body;
      const createdBy = req.user?.id;

      // Validate required fields
      if (!name || !phones || phones.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Name and at least one phone number are required'
        });
      }

      // Check for duplicates
      const duplicates = await CustomerModel.findDuplicates(name, address);
      if (duplicates.length > 0) {
        return res.status(409).json({
          success: false,
          error: 'Possible duplicate customers found',
          data: { duplicates }
        });
      }

      // Create customer
      const customer = await CustomerModel.create({
        name,
        address,
        notes,
        createdBy
      });

      // Add phone numbers
      const phonePromises = phones.map((phone, index) =>
        PhoneModel.create({
          customerId: customer.id,
          phone: phone.phone,
          isPrimary: index === 0 || phone.isPrimary
        })
      );

      await Promise.all(phonePromises);

      // Fetch complete customer with phones
      const completeCustomer = await CustomerModel.findById(customer.id);

      res.status(201).json({
        success: true,
        data: completeCustomer
      });
    } catch (error) {
      console.error('Error creating customer:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to create customer'
      });
    }
  },

  // Get customer by ID
  async getById(req, res) {
    try {
      const { id } = req.params;

      const customer = await CustomerModel.findById(id);
      if (!customer) {
        return res.status(404).json({
          success: false,
          error: 'Customer not found'
        });
      }

      // Get statistics
      const stats = await CustomerModel.getStats(id);

      res.json({
        success: true,
        data: { ...customer, stats }
      });
    } catch (error) {
      console.error('Error getting customer:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get customer'
      });
    }
  },

  // Search customers
  async search(req, res) {
    try {
      const { q, type = 'phone' } = req.query;

      if (!q) {
        return res.status(400).json({
          success: false,
          error: 'Search query is required'
        });
      }

      let customers = [];

      if (type === 'phone') {
        customers = await CustomerModel.findByPhone(q);
      } else if (type === 'name') {
        customers = await CustomerModel.searchByName(q);
      }

      res.json({
        success: true,
        data: customers
      });
    } catch (error) {
      console.error('Error searching customers:', error);
      console.error('Error details:', error.message, error.stack);
      res.status(500).json({
        success: false,
        error: 'Failed to search customers',
        details: error.message
      });
    }
  },

  // Get all customers with pagination
  async getAll(req, res) {
    try {
      const { limit = 50, offset = 0 } = req.query;

      const customers = await CustomerModel.findAll(
        parseInt(limit),
        parseInt(offset)
      );

      res.json({
        success: true,
        data: customers
      });
    } catch (error) {
      console.error('Error getting customers:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get customers'
      });
    }
  },

  // Update customer
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, address, notes } = req.body;
      const updatedBy = req.user?.id;

      const customer = await CustomerModel.update(id, {
        name,
        address,
        notes,
        updatedBy
      });

      if (!customer) {
        return res.status(404).json({
          success: false,
          error: 'Customer not found'
        });
      }

      // Get complete customer data
      const completeCustomer = await CustomerModel.findById(id);

      res.json({
        success: true,
        data: completeCustomer
      });
    } catch (error) {
      console.error('Error updating customer:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update customer'
      });
    }
  },

  // Delete customer (soft delete)
  async delete(req, res) {
    try {
      const { id } = req.params;
      const updatedBy = req.user?.id;

      const customer = await CustomerModel.softDelete(id, updatedBy);

      if (!customer) {
        return res.status(404).json({
          success: false,
          error: 'Customer not found'
        });
      }

      res.json({
        success: true,
        data: customer
      });
    } catch (error) {
      console.error('Error deleting customer:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete customer'
      });
    }
  },

  // Add phone number
  async addPhone(req, res) {
    try {
      const { id } = req.params;
      const { phone, isPrimary } = req.body;

      if (!phone) {
        return res.status(400).json({
          success: false,
          error: 'Phone number is required'
        });
      }

      const phoneRecord = await PhoneModel.create({
        customerId: id,
        phone,
        isPrimary
      });

      res.status(201).json({
        success: true,
        data: phoneRecord
      });
    } catch (error) {
      console.error('Error adding phone:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to add phone number'
      });
    }
  },

  // Set primary phone
  async setPrimaryPhone(req, res) {
    try {
      const { id, phoneId } = req.params;

      const phone = await PhoneModel.setPrimary(phoneId, id);

      if (!phone) {
        return res.status(404).json({
          success: false,
          error: 'Phone not found'
        });
      }

      res.json({
        success: true,
        data: phone
      });
    } catch (error) {
      console.error('Error setting primary phone:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to set primary phone'
      });
    }
  },

  // Delete phone
  async deletePhone(req, res) {
    try {
      const { phoneId } = req.params;

      const phone = await PhoneModel.delete(phoneId);

      if (!phone) {
        return res.status(404).json({
          success: false,
          error: 'Phone not found'
        });
      }

      res.json({
        success: true,
        data: phone
      });
    } catch (error) {
      console.error('Error deleting phone:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete phone'
      });
    }
  }
};

export default customerController;
