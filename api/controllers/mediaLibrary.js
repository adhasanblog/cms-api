const fs = require('fs');
const path = require('path');
const MediaLibrary = require('../models/mediaLibrary');

exports.getAllMedia = async (req, res) => {
  try {
    const medias = await MediaLibrary.findAll();
    medias.forEach(
      (media) => (media.media_details = JSON.parse(media.media_details)),
    );
    res.json(medias);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getMediaById = async (req, res) => {
  const { id } = req.params;
  try {
    const media = await MediaLibrary.findByPk(id);

    media.media_details = JSON.parse(media.media_details);
    res.json(media);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.addMedia = async (req, res) => {
  const { alt_text, description, title } = req.body;
  const [imageRawData, imagePosts, imageSquares] = req.images;
  const [imagePostSmall, imagePostMedium, imagePostLarge] = imagePosts;
  const [
    imageSquareSmall,
    imageSquareMedium,
    imageSquareLarge,
    imageSquareExtraLarge,
  ] = imageSquares;
  const serverUrl = `${process.env.SERVER_PROTOCOL}://${process.env.SERVER_ADDRESS}:${process.env.SERVER_PORT}`;
  const destination = req.file.destination.replace('public', '');
  const fileName = `${path.parse(req.file.filename).name}`;
  const randomName = req.file.filename.match(/^\d+/);

  const ext = path.extname(req.file.originalname).slice(1);

  let media_details = '';
  if (req.file) {
    media_details = JSON.stringify({
      file: `${req.file.filename}`,
      width: imageRawData.width,
      height: imageRawData.height,
      filesize: req.file.size,
      sizes: {
        original: {
          file: `${req.file.filename}`,
          width: imageRawData.width,
          height: imageRawData.height,
          source_url: `${serverUrl}${destination}/${fileName}.${ext}`,
          filesize: req.file.size,
        },
        small: {
          file: `${fileName}-${imagePostSmall.width}.${imagePostSmall.format}`,
          width: imagePostSmall.width,
          height: imagePostSmall.height,
          source_url: `${serverUrl}${destination}/${fileName}-${imagePostSmall.width}.${imagePostSmall.format}`,
          filesize: imagePostSmall.size,
        },

        medium: {
          file: `${fileName}-${imagePostMedium.width}.${imagePostMedium.format}`,
          width: imagePostMedium.width,
          height: imagePostMedium.height,
          source_url: `${serverUrl}${destination}/${fileName}-${imagePostMedium.width}.${imagePostMedium.format}`,
          filesize: imagePostMedium.size,
        },

        large: {
          file: `${fileName}-${imagePostLarge.width}.${imagePostLarge.format}`,
          width: imagePostLarge.width,
          height: imagePostLarge.height,
          source_url: `${serverUrl}${destination}/${fileName}-${imagePostLarge.width}.${imagePostLarge.format}`,
          filesize: imagePostLarge.size,
        },

        square_small: {
          file: `${fileName}-${imageSquareSmall.width}x${imageSquareSmall.height}.${imageSquareSmall.format}`,
          width: imageSquareSmall.width,
          height: imageSquareSmall.height,
          source_url: `${serverUrl}${destination}/${fileName}-${imageSquareSmall.width}x${imageSquareSmall.height}.${imageSquareSmall.format}`,
          filesize: imageSquareSmall.size,
        },

        square_medium: {
          file: `${fileName}-${imageSquareMedium.width}x${imageSquareMedium.height}.${imageSquareMedium.format}`,
          width: imageSquareMedium.width,
          height: imageSquareMedium.height,
          source_url: `${serverUrl}${destination}/${fileName}-${imageSquareMedium.width}x${imageSquareMedium.height}.${imageSquareMedium.format}`,
          filesize: imageSquareMedium.size,
        },

        square_large: {
          file: `${fileName}-${imageSquareLarge.width}x${imageSquareLarge.height}.${imageSquareLarge.format}`,
          width: imageSquareLarge.width,
          height: imageSquareLarge.height,
          source_url: `${serverUrl}${destination}/${fileName}-${imageSquareLarge.width}x${imageSquareLarge.height}.${imageSquareLarge.format}`,
          filesize: imageSquareLarge.size,
        },

        square_extra_large: {
          file: `${fileName}-${imageSquareExtraLarge.width}x${imageSquareExtraLarge.height}.${imageSquareExtraLarge.format}`,
          width: imageSquareExtraLarge.width,
          height: imageSquareExtraLarge.height,
          source_url: `${serverUrl}${destination}/${fileName}-${imageSquareExtraLarge.width}x${imageSquareExtraLarge.height}.${imageSquareExtraLarge.format}`,
          filesize: imageSquareExtraLarge.size,
        },
      },
    });
  }

  //simpan pengguna baru ke database
  try {
    const media = await MediaLibrary.create({
      author: req.user.id,
      alt_text,
      description,
      title: !title ? req.file.filename.replace(`${randomName}-`, '') : title,
      mime_type: req.file.mimetype,
      media_details,
    });

    media.media_details = JSON.parse(media.media_details);
    res.json(media);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteMedia = async (req, res) => {
  const { id } = req.params;
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();

  try {
    const media = await MediaLibrary.findByPk(id);
    const mediaDetails = JSON.parse(media.media_details);

    if (!media) {
      return res.status(404).json({ error: 'User not found' });
    }

    for (const size in mediaDetails.sizes) {
      const filePath = path.join(
        'public',
        'uploads',
        `${year}`,
        `${month}`,
        `${mediaDetails.sizes[size].file}`,
      );

      fs.unlinkSync(filePath);
    }

    await media.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
