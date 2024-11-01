const express = require('express');
const cors = require('cors');

const authRoute = require('./router/auth');
const postRoute = require('./router/post');
const usersRoute = require('./router/users');

const app = express();
const port = process.env.PORT || 10000;

app.use(express.json());

app.use(cors());

app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/users', usersRoute);

app.listen(port, () => {
  console.log(`server Running on Port ${port}`);
});
