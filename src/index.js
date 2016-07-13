var addCSS3D = require('./css3d');
THREE = addCSS3D(THREE);
var TWEEN = require('tween');

function Hyperdrive(container, nodes, cfg) {
  this.container = container;
  this.nodes = nodes;
  this.cfg = cfg;
  this.camera = {};
  this.scene = {};
  this.renderer = {};
  this.objects = [];
  this.paused = false;
  this.moveSpeed = 3;
  this.zDepth = cfg.zDepth || 20000;
  this.zoomInCb = cfg.zoomInCb || function(){};
  this.zoomOutCb = cfg.zoomOutCb || function(){};
  this.mountCb = cfg.mountCb || function(){};
  this.zoomed = false;
}

Hyperdrive.prototype = {

  'renderNodes': function(nodes) {
    nodes.forEach(this.addObject.bind(this));
  },

  'randomizeEnd': function(end) {
    var randDir = Math.round(Math.random() * 1);
    if (randDir === 1) {
      end = -(end);
    }

    return end;
  },

  'tweenIn': function(obj, cb) {
    new TWEEN.Tween(obj.position)
      .to({ y: Math.random() * 2000 - 1000 }, 2000)
      .easing(TWEEN.Easing.Exponential.Out)
      .onComplete(cb || function(){})
      .start();
  },

  'tweenOut': function(obj, cb) {
    var end = this.randomizeEnd(this.zDepth);

    new TWEEN.Tween(obj.position)
      .to({ y: end }, 15000)
      .easing(TWEEN.Easing.Exponential.Out)
      .onComplete(cb || function(){})
      .start();
  },

  'setElement': function(el, options) {
    el.innerHTML = options.html;

    Object.keys(options.style).forEach(function(s) {
      el.style[s] = options.style[s];
    });

    return el;
  },

  'getElements': function() {
    return this.objects;
  },

  'createObject': function(el, idx) {
    var obj = new THREE.CSS3DObject(el);
    obj.name = 'stream_element_' + idx;
    obj.position.x = Math.random() * 4000 - 2000;
    obj.position.y = this.randomizeEnd(3000);
    obj.position.z = Math.random() * -this.zDepth;

    return obj;
  },

  'addObject': function(options, idx) {
    if (!idx) {
      idx = this.objects.length;
    }
    // create CSS3D object
    var el = document.createElement('div');
    el.className = 'stream-element';
    el = this.setElement(el, options);
    var obj = this.createObject(el, idx);
    var self = this;

    el.addEventListener('click', function(event) {
      event.stopPropagation();
      self.paused = true;
      self.zoomed = true;

      var prev = obj.position.z + 400;
      var counter = 0;

      new TWEEN.Tween(self.camera.position)
        .to({ x: obj.position.x, y: obj.position.y - 25 }, 1500)
        .easing(TWEEN.Easing.Exponential.Out)
        .start();

      new TWEEN.Tween({ value: prev })
        .to({ value: 0 }, 2000)
        .onUpdate(function() {
          self.move(this.value - prev);
          prev = this.value;
        })
        .onComplete(function() {
          self.zoomInCb(obj)
        })
        .easing(TWEEN.Easing.Exponential.Out)
        .start();

    }, false );


    // add to scene
    this.scene.add(obj);
    this.objects.push(obj);
    // set props
    el.properties = {
      object: obj
    };

    this.mountCb(obj);
    // animate in
    this.tweenIn(obj);
  },

  'removeObject': function(idx) {
    if (!idx) {
      idx = Math.floor(Math.random() * this.objects.length);
    }

    var obj = this.objects[idx];
    if (!obj) {
      return console.warn('INCORRECT IDX OF ', idx, ' PROVIDED');
    }

    var self = this;
    this.tweenOut(this.objects[idx], function() {
      console.log('REMOVING ', idx, ' ', obj.name);
      obj.element.parentNode.removeChild(obj.element);
    });
  },

  'updateObject': function(idx, options) {
    if (!this.objects[idx]) {
      return console.warn('INCORRECT IDX OF ', idx, ' PROVIDED');
    }

    this.setElement(this.objects[idx].element, options);
  },

  'move': function(delta) {
    this.objects.forEach(function(obj) {
      obj.position.z += delta;

      if (obj.position.z > 0) {
        obj.position.z -= 20000;
      } else if (obj.position.z < -20000) {
        obj.position.z += 20000;
      }
    });
  },

  'onMouseWheel': function(event) {
    this.move(event.wheelDelta);
  },

  'onKey': function(event) {
    switch(event.keyCode) {
      case 83:
        this.paused = !this.paused;
        break;
      case 27:
        this.zoomOut();
        break;
      default:
        break;
    }
  },

  'zoomOut': function() {
    if (!this.zoomed) return;

    var self = this;
    new TWEEN.Tween(self.camera.position)
      .to({ x: 0, y: - 25 }, 1500)
      .easing(TWEEN.Easing.Exponential.Out)
      .onComplete(function() {
        self.paused = false;
        self.zoomed = false;
        self.zoomOutCb();
      })
      .start();
  },

  'onWindowResize': function() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  },

  'animate': function() {
    requestAnimationFrame(this.animate.bind(this));
    TWEEN.update();

    if (!this.paused) {
      this.move(this.moveSpeed);
    }

    this.renderer.render(this.scene, this.camera);
  },

  'attachListeners': function() {
    document.body.addEventListener('mousewheel', this.onMouseWheel.bind(this), false);
    document.body.addEventListener('click', this.zoomOut.bind(this), false);
    document.addEventListener('keydown', this.onKey.bind(this), false);
    window.addEventListener('resize', this.onWindowResize, false);
  },

  'startScene': function() {
    console.log('STARTING SCENE')
    this.camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 1, 5000
    );
    this.camera.position.y = -25;
    this.scene = new THREE.Scene();
    this.renderer = new THREE.CSS3DRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.top = 0;
    this.container.appendChild(this.renderer.domElement);

    this.attachListeners();
    this.renderNodes(this.nodes);
    this.animate();
    console.log(this.scene)
  }
}

module.exports = Hyperdrive;
