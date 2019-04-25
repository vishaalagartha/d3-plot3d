# d3-plot3d

d3-plot3d is a D3 plugin that allows users to plot 3D data, lines, polygons, curves, and surfaces.

## Installing

If you use NPM, `npm install d3-plot3d`. Otherwise, download the [latest release](https://github.com/vishaalagartha/d3-plot3d/releases).

## API Reference

* [d3.plot3d](#plot3d) - create a new 3d plot
* [*plot3d*.scale](#scale) - set the scale
* [*plot3d*.origin](#origin) - set the origin of 3d plot
* [*plot3d*.rotation](#rotation) - set the rotation of the 3d plot via yaw, pitch, and roll
* [*plot3d*.rotationFactor](#rotationFactor) - set the rotation speed on mousedrag events
* [*plot3d*.zoomFactor](#zoomFactor) - set the zoom factor on zoom events
* [*plot3d*.axes](#axes) - add a set of axes to the plot
* [*plot3d*.plot](#plot) - add a shape of specific type to the plot
* [*plot3d*.draw](#draw) - add a shape of specific type to the plot

## Overview

**d3-plot3d** projects data in the form of points using the logic employed by [perspective projections](https://en.wikipedia.org/wiki/3D_projection#Perspective_projection). It is meant to be used with [D3](https://d3js.org/) and allows users to visualize 3d data and transformations on SVG's. 

An example usage is shown below:
```
let svg = d3.select('body').append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
let plot = d3.plot3d()
                   .scale({scale: 10})
                   .origin({origin: {x: 0, y: 0, z: 0}})
                   .axes({xRange: 10, yRange: 10, zRange: 10})
                   .plot({type: 'line', data: [{x: 5, y: 10, z: 10}, {x: 10, y: 15, z: 10}], attributes: {stroke: 'purple'}}) 
                   .plot({type: 'polygon', data: [{x: 0, y: 0, z: 0}, {x: 10, y: 10, z: 10}, {x: 0, y: 10, z: 0}], attributes: {fill: 'orange'}}) 
                   .plot({type: 'curve', data: {x: (t) => 3*Math.cos(t), y: (t) => 3*Math.sin(t), z: (t) => t, tMin: -10, tMax: 10, tStep: 0.1}, attributes: {stroke: 'brown'}})
                   .plot({type: 'curve', data: {x: (t) => -3*Math.cos(t), y: (t) => 3*Math.sin(t), z: (t) => t, tMin: -10, tMax: 10, tStep: 0.1}, attributes: {stroke: 'maroon'}})
                   .plot({type: 'point', data: [{x: 10, y:0 , z:0}], attributes: {stroke: 'maroon'}})
                   .plot({type: 'surface', data: {z: (x, y) => Math.sin((x*x+y*y))}, attributes: {fill: 'purple'}})

svg.call(plot)

plot.draw()
```
For a visualization of this plot, refer to the following [bl.ock](https://bl.ocks.org/vishaalagartha/c772eb4973f68527e7d2ee46b0e12515).

<a href="#plot3d" name="plot3d">#</a> <b>plot3d</b>()

Construct a new plot with default settings. 

<a href="#scale" name="scale">#</a> <b>scale</b>(`{scale=100}`)

Defines the scale of 3d plot.

*Default*: `scale = 100`

<a href="#origin" name="origin">#</a> <b>origin</b>(`{origin={x:0, y:0, z:0}}`)

Defines where to place the origin of the plot. For example, if passed the point `{x: 10, y:0, z:0}`, then the point `{x: 10, y:0, z:0}` would appear at the center of the plot.

*Default*: `origin = {x: 0, y:0, z:0}`

<a href="#rotation" name="rotation">#</a> <b>rotation</b>(`{yaw=-2, pitch=0.66, roll=0}`)

Defines rotational elements according the [aircraft principal axes](https://en.wikipedia.org/wiki/Aircraft_principal_axes), based on the concepts of yaw, pitch and roll. For a full visualization for how each of these individual elements affect the plot, refer to [this demonstration](http://www.ctralie.com/Teaching/COMPSCI290/Materials/EulerAnglesViz/). 

*Default*: `yaw=-2, pitch=0.66, roll=0`

<a href="#rotationFactor" name="rotationFactor">#</a> <b>rotationFactor</b>(`{rotationFactor=1000}`)

Defines how much a mouse drag event rotates the plot where larger values cause the plot to rotate faster and vice a versa. Note that increasing/decreasing the rotation factor can affect render speed.

*Default*: `rotationFactor=1000`

<a href="#zoomFactor" name="zoomFactor">#</a> <b>zoomFactor</b>(`{zoomFactor=1}`)

Defines how much a click event on the `+` and `-` buttons at the top left of the plot zooms in or out. Note that increasing/decreasing the zoom factor can affect render speed

*Default*: `zoomFactor=1000`

<a href="#plot" name="plot">#</a> <b>plot</b>(`plot`)

Add a plot of specific type to the current plot. Plot types are defined as follows:

```
plot = {type, data, attributes} 
```

#### Plot types
**POINT**
Represented by an svg `<circle/>` element. `data` must be an array of objects, each representing an individual point. `attributes` is an object consisting of optional attributes the user can set including `fill`, `radius`, and `class`.

Example usage:
```
let plot = d3.plot3d()
                    .plot({type: 'point', data: [{x: 10, y:0 , z:0}], attributes: {fill: 'maroon'}})

```

**LINE**
Represented by an svg `<line/>`. `data` must be an array of 2 objects, each representing an individual point to draw the line between. `attributes` is an object consisting of optional attributes the user can set including `stroke_width`, `stroke`, and `class`.

Example usage:
```
let plot = d3.plot3d()
                   .plot({type: 'line', data: [{x: 5, y: 10, z: 10}, {x: 10, y: 15, z: 10}], attributes: {stroke: 'purple'}}) 

```

**POLYGON**
Represented by an svg `<polygon/>`. `data` must be an array of 3 or more objects, each representing an individual point to draw the lines between in sequence. `attributes` is an object consisting of optional attributes the user can set including `fill`, `opacity`, and `class`.

Example usage:
```
let plot = d3.plot3d()
                   .plot({type: 'polygon', data: [{x: 0, y: 0, z: 0}, {x: 10, y: 10, z: 10}, {x: 0, y: 10, z: 0}], attributes: {fill: 'orange'}}) 

```

**CURVE**
Represented by an svg `<path/>` and can be used to draw parametric curves. `data` must be an object defined as follows:
```
data = {x: x(t), y: y(t), z: z(t), tMin, tMax, tStep}
```
In the above object, x, y, and z are defined as functions of `t` and will be graphed in the domain specified by `[tMin, tMax]`. Individual points will be computed within the domain by incrementing `t` from `tMin` to `tMax` by `tStep` and interpolated via [d3.curveCardinal](https://github.com/d3/d3-shape#curveCardinal).

`attributes` is an object consisting of optional attributes the user can set including `stroke`, `stroke_width`, and `class`.

Example usage:
```
let plot = d3.plot3d()
                   .plot({type: 'curve', data: {x: (t) => 3*Math.cos(t), y: (t) => 3*Math.sin(t), z: (t) => t, tMin: -10, tMax: 10, tStep: 0.1}, attributes: {stroke: 'brown'}})
```

**SURFACE**
Represented by an svg multiple svg `<polygon/>` elements consisting of 4 points. `data` must be an object consisting of a `z` attribute defined as a function of `x` and `y` (i.e. `data = {z: z(x, y)}`). 

`attributes` is an object consisting of optional attributes the user can set including `opacity`, `fill`, and `class`. `fill` must be one of the following colors defined by `d3`'s [sequential single hue scales](https://github.com/d3/d3-scale-chromatic#interpolateBlues). Hence, `fill` must be one of the following: `'blue'`, `'green'`, `'grey'`, `'orange'`, `'purple'`, or `'red'`. 

Example usage:
```
let plot = d3.plot3d()
                   .plot({type: 'surface', data: {z: (x, y) => Math.sin((x*x+y*y))}, attributes: {fill: 'purple'}})
```


<a href="#draw" name="draw">#</a> <b>draw</b>()

Draw the plot according to the previously defined settings and shapes.
