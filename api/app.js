const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');

const app = express();

// middleware body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// rute default
app.get('/', function (req, res) {
  res.send('Hello World!');
});

// rute untuk user
app.use('/users', userRoutes);

app.use(express.static('public'));

// jalankan server
app.listen(3000, function () {
  console.log('Server started on port 3000...');
});
