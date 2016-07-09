<p align="center">
  <br />
  <img src="https://raw.githubusercontent.com/mannynotfound/html-hyperdrive/master/hyperdrive.gif" />
</p>

# :zap: HTML Hyperdrive :zap:

__Work In Progress__

A utility library for creating spatial, interactive CSS3D experiences.

## usage

See the `example/index.js` file for reference.

HTML Hyperdrive renders (HML) Hyperdrive Markup Language, which is just HTML as a string with some configuration...

eg:

```js
var htmlElms = [
  {
    height: 400,
    width: 300,
    html: '<h1>Title</h1>'
  },
  {
    height: 200,
    width: 300,
    html: '<h2>Sub Title</h2>'
  },
  {
    height: 600,
    width: 1000,
    html: '<p>Body <img src="lol.jpg" /></p>'
  }
]

var app = new HTMLHyperDrive(document.getElementById('container'), htmlElms);
app.startScene();
```

will render 3 stream elements with the provided height, width, and markup.

#### controls:

* `s` : start/stop auto drift 
