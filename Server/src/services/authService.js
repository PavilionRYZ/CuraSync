const jwt = require('jsonwebtoken');
const User = require('../models/User');


const register = async (userData) => {
  const user = await User.create(userData);
  const token = generateToken(user._id);
  
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    },
    token
  };
};


const login = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await user.comparePassword(password))) {
    throw new Error('Invalid credentials');
  }

  if (!user.isActive) {
    throw new Error('Account is inactive');
  }

  const token = generateToken(user._id);
  
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    },
    token
  };
};


const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

module.exports = {
  register,
  login,
  generateToken
};
