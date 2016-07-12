require('./app.css');
var HTMLHyperDrive = require('../src');
var lipsum = require('lorem-ipsum');
var nodes = [];

for (var i = 0; i < 100; i++) {
  nodes.push({
    style: {
      width: '300px',
      height: '300px',
    },
    html: '<h2>' + lipsum({count: 3, units: 'sentences'}) + '</h2>'
  });
}

var cfg = {
  zDepth: 20000,
  zoomInCb: function(obj) {
    console.log('ZOOM CB', obj);
  },
  zoomOutCb: function() {
    console.log('RETURNED FROM ZOOM');
  }
};

var app = new HTMLHyperDrive(document.getElementById('container'), nodes, cfg);
app.startScene();

setInterval(function() {
  var availableNodes = nodes.map(function(n, i) {
    return i;
  });

  function getRand(arr) {
    return Math.floor(Math.random() * arr.length);
  }

  var colors = ['lime', 'purple', 'orange'];
  var randIdx = getRand(availableNodes);
  availableNodes.splice(randIdx, 1);
  var randSwap = getRand(availableNodes);
  availableNodes.splice(randSwap, 1);
  var randAd = getRand(availableNodes);
  availableNodes.splice(randAd, 1);
  var randNode = nodes[randSwap];
  var randAdNode = nodes[randAd];
  var randColor = getRand(colors);
  randNode.style.color = colors[randColor];
  randAdNode.style.color = 'blue';

  app.updateObject(randIdx, randNode);
  app.addObject(randAdNode);
}, 5000);
