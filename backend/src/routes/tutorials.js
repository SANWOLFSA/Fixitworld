import express from 'express';
import { optionalAuth } from '../middleware/auth.js';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/tutorials
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, difficulty } = req.query;
    const where = {};

    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;

    const tutorials = await prisma.tutorial.findMany({
      where: { published: true, ...where },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        difficulty: true,
        estimatedTime: true,
        thumbnail: true,
        createdAt: true,
        premiumOnly: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ tutorials, total: tutorials.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tutorials' });
  }
});

// GET /api/tutorials/:id
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const tutorial = await prisma.tutorial.findUnique({
      where: { id: req.params.id },
      include: {
        steps: true,
        tools: true
      }
    });

    if (!tutorial) {
      return res.status(404).json({ error: 'Tutorial not found' });
    }

    // Check premium access
    if (tutorial.premiumOnly && !req.user?.isPremium) {
      return res.status(403).json({ error: 'Premium access required' });
    }

    res.json({ tutorial });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tutorial' });
  }
});

export default router;
