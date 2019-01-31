var express = require('express')
var proxy = require('http-proxy-middleware')
var path = require('path');
var app = express()

app.use('/', proxy({ target: 'http://rdctstbc001:4000/', changeOrigin: true }));
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.listen(3000)