const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const isAuth = require('../middleWares/isAuth');

const prisma = new PrismaClient();

// 投稿API
router.post('/post', isAuth, async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: '投稿内容がありません。' });
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        content: content,
        authorId: req.id,
      },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
      },
    });
    return res.status(201).json(newPost);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'サーバーエラー' });
  }
});

// 投稿取得のAPI
router.get('/get_latest_post', async (req, res) => {
  try {
    const latestPost = await prisma.post.findMany({
      //  限定された範囲を選択します
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
      },
    });

    return res.status(200).json(latestPost);
  } catch (err) {
    console.log(err);

    return res.status(500).json({ message: 'サーバーエラーです。' });
  }
});

// 特定のユーザーの投稿内容だけを取得
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const userPosts = await prisma.post.findMany({
      where: {
        authorId: parseInt(userId),
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: true,
      },
    });

    return res.status(200).json(userPosts);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'サーバーエラー' });
  }
});

// 特定の投稿の削除API

router.delete('/:postId', async (req, res) => {
  const { postId } = req.params;
  console.log(postId);
  try {
    const deletePost = await prisma.post.delete({
      where: {
        id: parseInt(postId),
      },
    });
    console.log(deletePost);

    return res.status(200).json(deletePost);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
