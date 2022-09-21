const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Quiz=require("../models/quizModel");

// Create JWT
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: '3d',
  });
};

// User signup
const signup = async (req, res) => {
  const { email, name, contact, college, year, password } = req.body;

  try {
    const exist = await User.findOne({ email });

    if (exist) {
      return res.status(400).json({ error: 'Email already exist!' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      name,
      contact,
      college,
      year,
      password: hash,
    });

    const token = createToken(user._id);

    return res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// User login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Incorrect email!' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ error: 'Incorrect password!' });
    }

    const token = createToken(user._id);

    return res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Add quiz category to the schema
const categorySelect = async (req,res)=>{
    const {email, quizCategory}=req.body;
    const user={
        quizCategory
    }
    User.findOneAndUpdate({email},user)
    .then((docs)=>{
      console.log(docs);
      res.end();
    })
    .catch((err)=>{
        res.status(400).json({ error: err.message });
    })
};

//Quiz Page
const quizAttempt=async (req,res)=>{
    const {quizCategory} = req.body;
    const quizzes=Quiz.findOne({category:quizCategory})
    .then((docs)=>{
      console.log(docs);
      res.json(quizzes);
    })
    .catch((err)=>{
      res.status(400).json({error:err.message});
    });
};

module.exports = { signup, login, categorySelect, quizAttempt };
