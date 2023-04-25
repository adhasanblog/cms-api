const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.loginAuthentication = async (req, res) => {
  const { username, password } = req.body;

  try {
    // cek apakah pengguna dengan username tersebut ada di database
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // verifikasi password pengguna
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // buat token jwt
    const token = jwt.sign({ userId: user.id }, 'cmsijp', {
      expiresIn: '7d',
    });

    res.json({
      message: 'Login Successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
