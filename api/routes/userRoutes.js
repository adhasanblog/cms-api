const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const path = require('path');
const multer = require('multer');

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
router.get('/', userController.getAllUsers);

// Menampilkan satu pengguna
router.get('/:id', userController.getUserById);

// Membuat pengguna baru
router.post('/', upload.single('photo'), userController.createUser);

// Memperbarui pengguna
router.put('/:id', upload.single('photo'), userController.updateUser);

// Menghapus pengguna
router.delete('/:id', userController.deleteUser);

module.exports = router;
