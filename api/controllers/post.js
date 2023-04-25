const path = require('path');
const Post = require('../models/post');

exports.getAllPosts = async (req, res) => {
  try {
    let posts;

    if (req.user.role === 'moderator') {
      posts = await Post.findAll({
        where: {
          user_id: req.user.id,
        },
      });

      if (!posts) {
        return res.status(404).json({ error: 'Data posts not found' });
      }

      return res.json(posts);
    }

    posts = await Post.findAll();
    posts.forEach((post) => (post.thumbnail = JSON.parse(post.thumbnail)));
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// fungsi untuk menampilkan satu pengguna
exports.getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.thumbnail = JSON.parse(post.thumbnail);
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createPost = async (req, res) => {
  const { title, slug, content, status } = req.body;

  const generateSlug = async (text) => {
    let textslug = text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9  \-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    return textslug;
  };

  let slugGenerated = '';
  if (slug.length === 0) {
    slugGenerated = await generateSlug(title);
  } else {
    slugGenerated = await generateSlug(slug);
  }

  const slugIsExist = await Post.findOne({
    where: {
      slug: slugGenerated,
    },
  });

  if (slugIsExist) {
    return res.status(409).json({ error: 'Slug already exists' });
  }

  const fileName = `${path.parse(req.file.filename).name}`;
  const ext = path.extname(req.file.originalname).slice(1);
  const sizes = [300, 600, 900];

  let thumbnail = '';
  if (req.file) {
    thumbnail = JSON.stringify({
      original: `${fileName}.${ext}`,
      small: `${fileName}-${sizes[0]}.${ext}`,
      medium: `${fileName}-${sizes[1]}.${ext}`,
      large: `${fileName}-${sizes[2]}.${ext}`,
    });
  }

  //simpan pengguna baru ke database
  try {
    const post = await Post.create({
      user_id: req.user.id,
      title,
      slug: slugGenerated,
      content,
      status,
      thumbnail,
    });

    post.thumbnail = JSON.parse(post.thumbnail);
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, slug, content, status } = req.body;

  try {
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: 'User not found' });
    }

    const generateSlug = async (text) => {
      let textslug = text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9  \-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

      return textslug;
    };

    let slugGenerated = '';
    if (slug.length === 0) {
      slugGenerated = await generateSlug(title);
    } else {
      slugGenerated = await generateSlug(slug);
    }

    const slugIsExist = await Post.findOne({
      where: {
        slug: slugGenerated,
      },
    });

    if (slugIsExist && post.slug !== slugGenerated) {
      return res.status(409).json({ error: 'Slug already exists' });
    }

    const fileName = `${path.parse(req.file.filename).name}`;
    const ext = path.extname(req.file.originalname).slice(1);
    const sizes = [300, 600, 900];

    let thumbnail = '';
    if (req.file) {
      thumbnail = JSON.stringify({
        original: `${fileName}.${ext}`,
        small: `${fileName}-${sizes[0]}.${ext}`,
        medium: `${fileName}-${sizes[1]}.${ext}`,
        large: `${fileName}-${sizes[2]}.${ext}`,
      });
    }
    if (req.user.role === 'moderator') {
      if (post.status !== status) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'No have access for update status post',
        });
      }
    }
    // update pengguna
    post.title = post.title === title ? post.title : title;
    post.slug = post.slug === slugGenerated ? post.slug : slugGenerated;
    post.content = content;
    post.status = status;
    post.thumbnail = post.thumbnail === thumbnail ? post.thumbnail : thumbnail;

    await post.save();
    post.thumbnail = JSON.parse(post.thumbnail);
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: 'User not found' });
    }

    await post.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
