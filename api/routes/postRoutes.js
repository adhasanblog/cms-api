const express = require('express');
const router = express.Router();
const postController = require('../controllers/post');
const path = require('path');
const multer = require('multer');
const auth = require('../middlewares/authorization');
const roles = require('../middlewares/roles');
const resizeImage = require('../middlewares/resizeImage');
const fs = require('fs');

const makeDirIfNotExist = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = 'public/uploads/posts';
      makeDirIfNotExist(uploadPath); // buat folder baru jika folder tidak ditemukan
      cb(null, uploadPath);
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
router.get('/', auth, postController.getAllPosts);

// Menampilkan satu pengguna
router.get('/:id', auth, roles.adminOnly, postController.getPostById);

// Membuat pengguna baru
router.post(
  '/',
  auth,
  upload.single('thumbnail'),
  resizeImage,
  postController.createPost,
);

router.put(
  '/:id',
  auth,
  upload.single('thumbnail'),
  resizeImage,
  postController.updatePost,
);

// // Menghapus pengguna
router.delete('/:id', auth, roles.adminOnly, postController.deletePost);

module.exports = router;
