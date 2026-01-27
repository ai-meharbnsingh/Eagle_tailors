import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

// Configure storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, WebP) are allowed'), false);
  }
};

// Multer upload configuration
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Process and save bill image
export const processBillImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    const filename = `${uuidv4()}.jpg`;
    const uploadDir = path.join(process.cwd(), '..', 'uploads', 'bills');
    const thumbnailDir = path.join(process.cwd(), '..', 'uploads', 'thumbnails');

    // Ensure directories exist
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.mkdir(thumbnailDir, { recursive: true });

    const imagePath = path.join(uploadDir, filename);
    const thumbnailPath = path.join(thumbnailDir, `thumb_${filename}`);

    // Process main image: compress and optimize
    await sharp(req.file.buffer)
      .resize(1920, null, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({
        quality: 85,
        progressive: true
      })
      .toFile(imagePath);

    // Generate thumbnail
    await sharp(req.file.buffer)
      .resize(400, 400, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({
        quality: 80
      })
      .toFile(thumbnailPath);

    // Add paths to request
    req.files = {
      image: [{ path: `/uploads/bills/${filename}` }],
      thumbnail: [{ path: `/uploads/thumbnails/thumb_${filename}` }]
    };

    next();
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process image'
    });
  }
};

// Process multiple bill images
export const processBillImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next();
    }

    const uploadDir = path.join(process.cwd(), '..', 'uploads', 'bills');
    const thumbnailDir = path.join(process.cwd(), '..', 'uploads', 'thumbnails');

    // Ensure directories exist
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.mkdir(thumbnailDir, { recursive: true });

    const processedFiles = await Promise.all(
      req.files.map(async (file) => {
        const filename = `${uuidv4()}.jpg`;
        const imagePath = path.join(uploadDir, filename);
        const thumbnailPath = path.join(thumbnailDir, `thumb_${filename}`);

        // Process main image
        await sharp(file.buffer)
          .resize(1920, null, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .jpeg({
            quality: 85,
            progressive: true
          })
          .toFile(imagePath);

        // Generate thumbnail
        await sharp(file.buffer)
          .resize(400, 400, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .jpeg({
            quality: 80
          })
          .toFile(thumbnailPath);

        return {
          imagePath: `/uploads/bills/${filename}`,
          thumbnailPath: `/uploads/thumbnails/thumb_${filename}`,
          originalName: file.originalname
        };
      })
    );

    req.processedFiles = processedFiles;

    next();
  } catch (error) {
    console.error('Error processing images:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process images'
    });
  }
};

export default { upload, processBillImage, processBillImages };
