const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const corsOptions = {
  origin: ['http://localhost:8080', 'https://e-vinci.github.io'],
  Credential: true,
};

const usersRouter = require('./routes/users');
const quizzesRouter = require('./routes/quizzes');
const badgesRouter = require('./routes/badges');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors(corsOptions));

app.use('/users', usersRouter);
app.use('/quizzes', quizzesRouter);
app.use('/badges', badgesRouter);

module.exports = app;
