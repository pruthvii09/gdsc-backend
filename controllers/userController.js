const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/userModel');

// Create JWT
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: '3d',
  });
};

// User signup
const signup = async (req, res) => {
  const { email, name, contact, college, year, password, quizCategory } =
    req.body;

  try {
    const exist = await User.findOne({ email });

    if (exist) {
      return res.status(400).json({ error: 'Email already exist!' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const scores = [];
    quizCategory.map((category) =>
      scores.push({
        category: category,
        caregoryScore: 0,
        submitted: false,
      })
    );

    const user = await User.create({
      email,
      name,
      contact,
      college,
      year,
      password: hash,
      quizCategory,
      score: scores,
    });

    const token = createToken(user._id);

    return res.status(200).json({ email, token, id: user._id });
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

    return res.status(200).json({ email, token, id: user._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get profile info
const getSingleProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select(
      'email name contact college year quizCategory'
    );

    if (!user) {
      return res.status(400).json({ error: 'Could not found user' });
    }

    if (req.user._id.toString() === id) {
      return res.status(200).json(user);
    }

    res.status(400).json({ error: 'Could not found user' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Forget password
const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      res
        .status(400)
        .json({ error: 'There is no account registered with this email!' });
    }

    const mailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailDetails = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Password Reset Request',
      html: `<p>Hello <b><i>${user.name}</i></b><br/> 
      Follow this link to reset your password for GDSC PES MCOE Android Compose Camp's account!
      <a href="https://gdsc-pesmcoe.vercel.app/forgot/${user._id}">Click here to reset password!</a><br/>If you didn't ask to reset your password, you can ignore this email.<br/>Regards,<br/><b>GDSC PES MCOE.</b>
      </p>`,
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
      if (err) {
        res.status(400).json({ error: err });
      } else {
        res.status(200).json({ message: 'Email send!!' });
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update forward
const updatePassword = async (req, res) => {
  const { password } = req.body;
  const { id } = req.params;

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await User.findOneAndUpdate(
      {
        _id: id,
      },
      { password: hash }
    );

    if (!user) {
      return res.status(400).json({ error: 'Could not change password!' });
    }
    res.status(200).json({ message: 'Password changed successfully!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add score for quiz category
const addScoreForQuizCategory = async (req, res) => {
  const { category, categoryScore } = req.body;
  const { id } = req.params;

  try {
    console.log(req.user._id.toString() === id);

    if (req.user._id.toString() === id) {
      const user = await User.findById(id);
      // console.log(user);

      res.status(400).json({ error: 'Not selected category' });
    }
  } catch (error) {}

  // res.status(200).json({ message: 'Score added' });
};

// Send mail for registration
const sendMail = async (req, res) => {
  const { category } = req.params;

  // try {
  //   const users = await User.find({ quizCategory: category }).limit(1);

  //   if (users) {
  //     users.map((user) => {
  //       const mailTransporter = nodemailer.createTransport({
  //         service: 'gmail',
  //         auth: {
  //           user: process.env.EMAIL,
  //           pass: process.env.PASSWORD,
  //         },
  //       });

  //       const mailDetails = {
  //         from: process.env.EMAIL,
  //         to: user.email,
  //         subject: `Slot Confirmation for ${category}!`,
  //         html: `<p>Hello <b><i>${user.name},</i></b><br/>
  //         &nbsp;&nbsp;&nbsp;&nbsp;Thank you for registering for ${category} quiz. Your reservation for ${category} quiz has been confirmed.<br/><br/>You can find more information about quiz below.<br/><b>Date & time:</b> 30 September 2022 & {Time here}<br/><b>Location:</b>{Loaction here}<br/><br/><br/>Regards,<br/><b>GDSC PES MCOE.</b>
  //         </p>`,
  //       };

  //       mailTransporter.sendMail(mailDetails, function (err, data) {
  //         if (err) {
  //           return res.status(400).json({ error: err });
  //         } else {
  //           return res.status(200).json({ message: 'Email send!!' });
  //         }
  //       });
  //     });
  //   }
  // } catch (error) {
  //   return res.status(400).json({ error: error.message });
  // }

  const users = await User.find({ quizCategory: category }).limit(300);

  res
    .status(200)
    .json({ message: `Registered users for ${category} are: ${users.length}` });
};

module.exports = {
  signup,
  login,
  getSingleProfile,
  forgetPassword,
  updatePassword,
  sendMail,
  addScoreForQuizCategory,
};
