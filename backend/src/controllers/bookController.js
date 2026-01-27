import BookModel from '../models/Book.js';

export const bookController = {
  // Create new book
  async create(req, res) {
    try {
      const { name, startSerial, endSerial, isCurrent } = req.body;

      if (!name || !startSerial) {
        return res.status(400).json({
          success: false,
          error: 'Name and start serial are required'
        });
      }

      const book = await BookModel.create({
        name,
        startSerial: parseInt(startSerial),
        endSerial: endSerial ? parseInt(endSerial) : null,
        isCurrent: isCurrent || false
      });

      res.status(201).json({
        success: true,
        data: book
      });
    } catch (error) {
      console.error('Error creating book:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create book'
      });
    }
  },

  // Get book by ID
  async getById(req, res) {
    try {
      const { id } = req.params;

      const book = await BookModel.findById(id);

      if (!book) {
        return res.status(404).json({
          success: false,
          error: 'Book not found'
        });
      }

      res.json({
        success: true,
        data: book
      });
    } catch (error) {
      console.error('Error getting book:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get book'
      });
    }
  },

  // Get current book
  async getCurrent(req, res) {
    try {
      const book = await BookModel.getCurrent();

      if (!book) {
        return res.status(404).json({
          success: false,
          error: 'No current book found'
        });
      }

      res.json({
        success: true,
        data: book
      });
    } catch (error) {
      console.error('Error getting current book:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get current book'
      });
    }
  },

  // Get all books
  async getAll(req, res) {
    try {
      const books = await BookModel.findAll();

      res.json({
        success: true,
        data: books
      });
    } catch (error) {
      console.error('Error getting books:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get books'
      });
    }
  },

  // Update book
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, startSerial, endSerial, isCurrent } = req.body;

      const book = await BookModel.update(id, {
        name,
        startSerial: startSerial ? parseInt(startSerial) : undefined,
        endSerial: endSerial ? parseInt(endSerial) : undefined,
        isCurrent
      });

      if (!book) {
        return res.status(404).json({
          success: false,
          error: 'Book not found'
        });
      }

      res.json({
        success: true,
        data: book
      });
    } catch (error) {
      console.error('Error updating book:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update book'
      });
    }
  },

  // Set book as current
  async setCurrent(req, res) {
    try {
      const { id } = req.params;

      const book = await BookModel.setCurrent(id);

      if (!book) {
        return res.status(404).json({
          success: false,
          error: 'Book not found'
        });
      }

      res.json({
        success: true,
        data: book
      });
    } catch (error) {
      console.error('Error setting current book:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to set current book'
      });
    }
  },

  // Get next folio number
  async getNextFolio(req, res) {
    try {
      const { id } = req.params;

      const nextFolio = await BookModel.getNextFolioNumber(id);

      res.json({
        success: true,
        data: { nextFolio }
      });
    } catch (error) {
      console.error('Error getting next folio:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get next folio number'
      });
    }
  },

  // Check if folio exists
  async checkFolio(req, res) {
    try {
      const { id } = req.params;
      const { folio } = req.query;

      if (!folio) {
        return res.status(400).json({
          success: false,
          error: 'Folio number is required'
        });
      }

      const exists = await BookModel.folioExists(id, parseInt(folio));

      res.json({
        success: true,
        data: { exists }
      });
    } catch (error) {
      console.error('Error checking folio:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to check folio'
      });
    }
  },

  // Delete book
  async delete(req, res) {
    try {
      const { id } = req.params;

      const book = await BookModel.delete(id);

      if (!book) {
        return res.status(400).json({
          success: false,
          error: 'Cannot delete book with existing bills'
        });
      }

      res.json({
        success: true,
        data: book
      });
    } catch (error) {
      console.error('Error deleting book:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete book'
      });
    }
  }
};

export default bookController;
