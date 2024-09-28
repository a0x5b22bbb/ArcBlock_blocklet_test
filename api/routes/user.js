const express = require('express');
const { check, validationResult } = require('express-validator');
const { getUserProfile, updateUserProfile } = require('../models/user');
const axios = require('axios');
const router = express.Router();

// Get user profile
router.get('/profile', (req, res) => {
  try {
    const user = getUserProfile();
    res.json(user);
    console.log('profile get!!')
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update user profile
router.put('/profile', [
  check('username')
    .isString()
    .withMessage('Username must be a string')
    .isLength({ min: 3})
    .withMessage('Username must be at least 3 characters'),
  
  check('email')
    .isEmail()
    .withMessage('Invalid email address')
    .notEmpty()
    .withMessage('Email is required'),
  
  check('phone')
    .isMobilePhone()
    .withMessage('Invalid phone number')
    .notEmpty()
    .withMessage('Phone is required')
      
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  console.log('profile put!!')

  const { id, username, email, phone } = req.body;
  try {
    updateUserProfile(id, username, email, phone);
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

// Add lookup phone location
router.get('/phone-location', async(req, res) => {
  const { phone }= req.query;

  if (!phone) {
    return res.status(400).json({ error: "Phone number is required"});
  }

  try {
    const response = await axios.get(`https://cx.shouji.360.cn/phonearea.php?number=${phone}`);
    console.log(response.data.data, response.data.code)
    if (response.data && response.data.code === 0) {
      res.status(200).json(response.data.data);
    } else {
      res.status(400).json({ error: 'Failed to fetch phone location' });
    }
  } catch (err) {
    console.error('Error fetching phone location:', err)
    res.status(500).json({error: 'Failed to fetch phone location'})
  }

})


module.exports = router;
