const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const path = require('path');
const multer = require('multer');
const auth = require('../middlewares/authorization');
const roles = require('../middlewares/roles');
const resizeImage = require('../middlewares/resizeImage');
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads/users');
    },
    filename: (req, file, cb) => {
      const filename = `${Date.now()}-${file.originalname}`;
      cb(null, filename);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(
        new Error(
          'File type not supported. Only JPEG, JPG, and PNG are allowed.',
        ),
      );
    }
  },
});

// Menampilkan semua pengguna
router.get('/', auth, userController.getAllUsers);

// Menampilkan satu pengguna
router.get('/:id', auth, roles.adminOnly, userController.getUserById);

// Membuat pengguna baru
router.post(
  '/',
  auth,
  upload.single('photo'),
  roles.adminOnly,
  userController.createUser,
);

// Memperbarui pengguna
router.put(
  '/:id',
  auth,
  upload.single('photo'),
  resizeImage,
  roles.adminOnly,
  userController.updateUser,
);

// Menghapus pengguna
router.delete('/:id', auth, roles.adminOnly, userController.deleteUser);

module.exports = router;
