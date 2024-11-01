const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const dummyIcon = require('../utils/dummyIcon');

const prisma = new PrismaClient();

// 新規登録API
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  //   hash後にhash化したパスワードをデータベース等に保存する処理を書くことが多いと思いますが、その場合async awaitをつけないとハッシュ化が終わる前に次の保存処理を実行してしまう為、passwordがみつかりませんよ！みたいなエラーが出る。
  const hashPassword = await bcrypt.hash(password, 10);

  const defaultIcon = dummyIcon(email);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashPassword,
      profile: {
        create: {
          bio: 'Hello',
          profileImageUrl: defaultIcon,
        },
      },
    },
    include: {
      profile: true,
    },
  });
  return res.status(200).json({ user });
});

// ログインAPI
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // email unifiedの可能性
  if (!email) return;

  // emailでDBのユーザーを探す
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  console.log(user);

  if (!user) {
    return res.status(401).json('ユーザーは存在しません。');
  }

  // passwordの検証

  const verificationPassword = await bcrypt.compare(password, user.password);

  if (!verificationPassword) {
    return res.status(401).json('パスワードが違います。');
  }

  // email password 正しい JWT

  const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
    expiresIn: '1d',
  });

  return res.json({ token: token });
});

module.exports = router;
