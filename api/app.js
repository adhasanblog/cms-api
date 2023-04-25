const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const mediaLibraryRoutes = require('./routes/mediaLibraryRoutes');

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3001', // atur asal permintaan lintas domain
  }),
);

// middleware body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// rute default
app.get('/', function (req, res) {
  res.send('Hello World!');
});

// rute untuk user
app.use('/users', userRoutes);

// rute untuk auth
app.use('/auth', authRoutes);

// rute untuk post
app.use('/posts', postRoutes);

app.use('/medias', mediaLibraryRoutes);

app.use(express.static('public'));

// jalankan server
app.listen(3000, function () {
  console.log('Server started on port 3000...');
});
