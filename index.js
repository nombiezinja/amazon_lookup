require('dotenv').config({
  silent: true
});

const ENV = process.env.NODE_ENV;
const port = process.env.PORT || 8080;
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

app.set('view engine', 'ejs');
app.set('views', './public');
app.use(express.static('public'));

server.listen(port, function listening() {
  console.log('Listening on %d', server.address().port);
});

app.get('/', (req, res) => {
  res.render('index');
});

module.exports = server;

