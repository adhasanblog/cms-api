const path = require('path');
const sharp = require('sharp');

const resizeImage = (req, res, next) => {
  if (req.file) {
    const filePath = path.join(req.file.destination, req.file.filename);
    const ext = path.extname(req.file.originalname); // dapatkan ekstensi file yang diunggah

    // ukuran gambar yang diinginkan
    const sizes = [300, 600, 900];
    const squareSize = [180, 240, 320, 480];

    // jalankan Sharp.js pada setiap ukuran gambar yang diinginkan

    const rawImage = () => {
      return sharp(filePath).metadata();
    };

    const imagesPost = Promise.all(
      sizes.map((size) => {
        const filename = `${path.parse(req.file.filename).name}-${size}.webp`; // tambahkan ekstensi file yang dinamis

        const images = sharp(filePath)
          .resize(size)
          .withMetadata()
          .toFormat('webp')
          .webp({ quality: 80 })
          .toFile(path.join(req.file.destination, filename));

        return images;
      }),
    );

    const imageSquare = Promise.all(
      squareSize.map((size) => {
        const filename = `${
          path.parse(req.file.filename).name
        }-${size}x${size}.webp`; // tambahkan ekstensi file yang dinamis

        const images = sharp(filePath)
          .resize(size, size)
          .withMetadata()
          .toFormat('webp')
          .webp({ quality: 80 })
          .toFile(path.join(req.file.destination, filename));

        return images;
      }),
    );

    Promise.all([rawImage(), imagesPost, imageSquare])
      .then((images) => {
        req.images = images;

        console.log(images);
        next();
      })
      .catch((error) => {
        console.log(error);
        next();
      });
  } else {
    next();
  }
};

module.exports = resizeImage;
