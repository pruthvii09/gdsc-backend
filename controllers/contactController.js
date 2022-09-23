const Contact = require('../models/contactModel');

const contactUs = async (req, res) => {
  const { name, email, description } = req.body;

  try {
    const contact = await Contact.create({ name, email, description });

    if (contact) {
      return res
        .status(200)
        .json({ message: 'Thank you for filling out your information!' });
    }

    res.status(400).json({ error: 'Could not able to contact!' });
  } catch (error) {
    res.status(400).json({ errro: error.message });
  }

  res.status(200).json({ message: 'Contact Us!' });
};

module.exports = { contactUs };
