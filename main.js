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
