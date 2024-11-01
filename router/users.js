const express = require('express');
const router = express.Router();
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const isAuth = require('../middleWares/isAuth');

const prisma = new PrismaClient();

router.get('/find', isAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.id,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'ユーザーが見つかりません' });
    }

    return res
      .status(200)
      .json({ id: user.id, email: user.email, username: user.username });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// profile情報の取得API
router.get('/profile/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const profile = await prisma.profile.findUnique({
      where: {
        userId: parseInt(userId),
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });
    console.log(profile);
    if (!profile) {
      return res
        .status(404)
        .json({ message: 'プロフィールが見つかりません。' });
    }
    return res.status(200).json(profile);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
