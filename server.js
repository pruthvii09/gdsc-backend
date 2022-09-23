require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRouter = require('./routes/userRouter');
const quizRouter = require('./routes/quizRouter');
const contactRouter = require('./routes/contactRouter');

// Initialize app
const app = express();

// Use middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', userRouter);
app.use('/api/quizzes', quizRouter);
app.use('/api/contact', contactRouter);

// Mongodb connect
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server listening on ${process.env.PORT}...`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
