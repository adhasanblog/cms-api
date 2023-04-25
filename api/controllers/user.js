const User = require('../models/user');
const bcrypt = require('bcryptjs');

// fungsi untuk menampilkan semua pengguna
exports.getAllUsers = async (req, res) => {
  console.log(req.user);
  try {
    let users = '';

    if (req.user.role === 'moderator') {
      users = await User.findByPk(req.user.id);

      return res.json(users);
    }

    users = await User.findAll();

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// fungsi untuk menampilkan satu pengguna
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// fungsi untuk membuat pengguna baru
exports.createUser = async (req, res) => {
  const { username, password, name, email, role } = req.body;

  const usernameIsExist = await User.findOne({
    where: {
      username,
    },
  });

  const emailIsExist = await User.findOne({
    where: {
      email,
    },
  });

  if (usernameIsExist)
    return res.status(409).json({ error: 'Username already exists' });

  if (emailIsExist)
    return res.status(409).json({ error: 'Email already exists' });

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  let photo = '';
  if (req.file) {
    photo = req.file.filename;
  }

  //simpan pengguna baru ke database
  try {
    const user = await User.create({
      username,
      password: passwordHash,
      name,
      email,
      role,
      photo,
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// fungsi untuk memperbarui pengguna
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, password, name, email, role } = req.body;

  console.log(req.file);

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // hash password
    const salt = bcrypt.genSaltSync(10);

    const passwordHash = bcrypt.hashSync(password, salt);

    let photo = '';
    if (req.file) {
      photo = '/uploads/users/' + req.file.filename;
    }

    // update pengguna
    user.username = username;
    user.password = passwordHash;
    user.name = name;
    user.email = email;
    user.role = role;
    user.photo = photo;
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// fungsi untuk menghapus pengguna
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
