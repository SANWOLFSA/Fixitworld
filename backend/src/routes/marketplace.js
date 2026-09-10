import express from 'express';
import { authMiddleware, optionalAuth } from '../middleware/auth.js';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/marketplace/listings
router.get('/listings', optionalAuth, async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search } = req.query;
    const where = {};

    if (category) where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseInt(minPrice);
      if (maxPrice) where.price.lte = parseInt(maxPrice);
    }

    const listings = await prisma.listing.findMany({
      where: { ...where, status: 'ACTIVE' },
      include: {
        seller: { select: { id: true, email: true, country: true, ficaVerified: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    res.json({ listings, total: listings.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// POST /api/marketplace/listings (Create)
router.post('/listings', authMiddleware, async (req, res) => {
  try {
    const { title, description, category, brand, size, price, images } = req.body;
    const userId = req.user.id;

    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        category,
        brand,
        size,
        price: parseInt(price),
        images: images || [],
        sellerId: userId,
        status: 'ACTIVE'
      }
    });

    res.status(201).json({ message: 'Listing created', listing });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

export default router;
