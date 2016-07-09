function Hyperdrive(container, nodes) {
  this.container = container;
  this.nodes = nodes;
  this.camera = {};
  this.scene = {};
  this.renderer = {};
  this.objects = [];
  this.paused = false;
  this.moveSpeed = 3;
}

Hyperdrive.prototype = {

  'renderNodes': function(nodes) {
    nodes.forEach(this.addHyperdriveItem.bind(this));
  },

  'tweenIn': function(obj) {
    new TWEEN.Tween(obj.position)
      .to({ y: Math.random() * 2000 - 1000 }, 2000)
      .easing(TWEEN.Easing.Exponential.Out)
      .start();
  },

  'createElement': function(childNode) {
    var el = document.createElement('div');
    el.className = 'stream-element';
    el.innerHTML += childNode.html;
    el.style.width = childNode.width + 'px';
    el.style.height = childNode.height + 'px';

    return el;
  },

  'createObject': function(el) {
    var obj = new THREE.CSS3DObject(el);
    obj.position.x = Math.random() * 4000 - 2000;
    obj.position.y = 3000;
    obj.position.z = Math.random() * -5000;

    return obj;
  },

  'addHyperdriveItem': function(childNode) {
    // create CSS3D object
    var el = this.createElement(childNode);
    var obj = this.createObject(el);
    var self = this;
    el.addEventListener('click', function(event) {
      event.stopPropagation();
      self.paused = true;

      var prev = obj.position.z + 400;

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
        .easing(TWEEN.Easing.Exponential.Out)
        .start();
    }, false );

    // add to scene
    this.scene.add(obj);
    this.objects.push(obj);
    // set props
    el.properties = {
      object: obj
    }
    // animate in
    this.tweenIn(obj);
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
    this.move(event.wheelDelta)
  },

  'onKey': function(event) {
    console.log(event.keyCode);
    if (event.keyCode !== 83) return;

    this.paused = !this.paused;
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

    var self = this;
    document.body.addEventListener('click', function(event) {
      new TWEEN.Tween(self.camera.position)
          .to({ x: 0, y: - 25 }, 1500)
          .easing(TWEEN.Easing.Exponential.Out)
          .start();
    }, false);

    document.addEventListener('keydown', this.onKey.bind(this), false);
    window.addEventListener('resize', this.onWindowResize, false);
  },

  'startScene': function() {
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
  }
}

module.exports = Hyperdrive;
