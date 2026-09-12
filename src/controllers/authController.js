const jwt = require('jsonwebtoken');
const User = require('../models/User');

const otpStore = {};

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, phone: user.phone },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

const sendOtp = async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ message: 'Phone number is required' });

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  otpStore[phone] = { otp, expires: Date.now() + 5 * 60 * 1000 };

  console.log(`📱 OTP for ${phone}: ${otp}`);

  res.status(200).json({ message: 'OTP sent successfully' });
};

const verifyOtp = async (req, res) => {
  const { phone, otp, name } = req.body;

  const record = otpStore[phone];
  if (!record) return res.status(400).json({ message: 'No OTP requested for this number' });
  if (Date.now() > record.expires) return res.status(400).json({ message: 'OTP expired' });
  if (record.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

  delete otpStore[phone];

  let user = await User.findOne({ where: { phone } });

  if (!user) {
    user = await User.create({ phone, name: name || 'BORX User' });
  }

  const token = generateToken(user);

  res.status(200).json({
    message: 'Login successful',
    token,
    user: { id: user.id, name: user.name, phone: user.phone },
  });
};

module.exports = { sendOtp, verifyOtp };