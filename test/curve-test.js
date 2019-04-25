let tape = require('tape'),
    JSDOM = require('jsdom').JSDOM
    d3 = require('d3'),
    _d3 = require('../')

tape('test curve plotting', function(test) {
  const window = (new JSDOM(`<html><head></head><body></body></html>`, { pretendToBeVisual: true })).window;

  window.d3 = d3.select(window.document)

  let svg = window.d3.select('body')
                  .append('svg')
                  .attr('xmlns', 'http://www.w3.org/2000/svg')
                  .attr('width', 512)
                  .attr('height', 512)

  let plot = _d3.plot3d()
                .plot({type: 'curve', data: {x: (t) => 3*Math.cos(t), y: (t) => 3*Math.sin(t), z: (t) => t, tMin: -10, tMax: 10, tStep: 0.1}, attributes: {stroke: 'brown', stroke_width: 1, class: 'curveClass1'}})
                .plot({type: 'curve', data: {x: (t) => -3*Math.cos(t), y: (t) => 3*Math.sin(t), z: (t) => t, tMin: -10, tMax: 10, tStep: 0.1}, attributes: {stroke: 'maroon'}})
  svg.call(plot)

  plot.draw()

  let curves = window.d3.selectAll('path')
  test.equal(curves.size(), 2)


  setTimeout(() => {
    let oneCurve = window.d3.select('path')
    test.equal(oneCurve.attr('stroke'), 'rgb(165, 42, 42)')
    test.equal(oneCurve.attr('stroke-width'), '1')
    test.equal(oneCurve.attr('class'), 'data curveClass1')
  }, 3000)

  test.end()
})
