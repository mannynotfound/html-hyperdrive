require('./app.css');
var HTMLHyperDrive = require('../src');
var lipsum = require('lorem-ipsum');
var nodes = [];

for (var i = 0; i < 100; i++) {
  nodes.push({
    width: 300,
    height: 300,
    html: '<h2>' + lipsum({count: 3, units: 'sentences'}) + '</h2>'
  });
}

var app = new HTMLHyperDrive(document.getElementById('container'), nodes);
app.startScene();
