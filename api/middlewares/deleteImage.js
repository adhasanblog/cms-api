const fs = require('fs');
const path = require('path');

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.id } });
    if (post) {
      const mediaDetails = JSON.parse(post.media_details);
      if (mediaDetails && mediaDetails.sizes) {
        for (const size in mediaDetails.sizes.posts) {
          const filePath = path.join(
            __dirname,
            '..',
            'public',
            'uploads',
            'posts',
            mediaDetails.sizes.posts[size].file,
          );
          fs.unlinkSync(filePath);
        }
      }
      await Post.destroy({ where: { id: req.params.id } });
      res.json({ message: 'Post deleted successfully' });
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
