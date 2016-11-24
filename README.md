<p align="center">
  <br />
  <img src="https://raw.githubusercontent.com/mannynotfound/html-hyperdrive/master/hyperdrive.gif" />
</p>

# :zap: HTML Hyperdrive :zap:

__Work In Progress__

A utility library for creating spatial, interactive CSS3D experiences.

### Usage

See the `example/index.js` file for reference.

HTML Hyperdrive renders HML (Hyperdrive Markup Language), which is just HTML as a string with some configuration...

eg:

```js
var HTMLHyperDrive = require('html-hyperdrive');
var htmlElms = [
  {
    style: {
      height: '400px',
      width: '300px',
    },
    html: '<h1>Title</h1>'
  },
  {
    style: {
      height: '400px',
      width: '300px',
      boxSizing: 'border-box',
    },
    html: '<h2>Sub Title</h2>'
  },
  {
    style: {
      height: '600px',
      width: '800px',
    },
    html: '<p>Body <img src="lol.jpg" /></p>'
  }
];

var app = new HTMLHyperDrive(document.getElementById('container'), htmlElms);
app.startScene();
```

will render 3 stream elements with the provided styles (write in JS syntax), and markup.

### Configuration

optionally, you can pass a config object as the 3rd parameter as so

```js
var container = document.getElementById( ... );
var htmlElms = { ... };
var config = { ... };
var app = new HTMLHyperDrive(container, htmlElms, config);
```

Key | Description
:------- | :----------
moveSpeed | Speed for "automove". Default is 3
xRange | The range of possible x values (affects how close/far elements are from each other)
zDepth | The z depth of the total cluster of elements.
zoomInCb | Callback fired when an element is clicked and "zoomed" into. Will callback with the obj as first parameter.
zoomOutCb | Callback fired when body is clicked from "zoomed" state and return to all elements.
mountCb | Callback fired when an element is initially rendered into DOM. Will callback with the obj as first parameter.


#### Controls:

* `s` : start/stop auto drift 
* `esc` : zoom out of zoomed in view
