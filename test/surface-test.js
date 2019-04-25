let tape = require('tape'),
    JSDOM = require('jsdom').JSDOM
    d3 = require('d3'),
    _d3 = require('../')

tape('test surface plotting', function(test) {
  const window = (new JSDOM(`<html><head></head><body></body></html>`, { pretendToBeVisual: true })).window;

  window.d3 = d3.select(window.document)

  let svg = window.d3.select('body')
                  .append('svg')
                  .attr('xmlns', 'http://www.w3.org/2000/svg')
                  .attr('width', 512)
                  .attr('height', 512)

  let plot = _d3.plot3d()
                .plot({type: 'surface', data: {z: (x, y) => Math.sin((x*x+y*y))}, attributes: {fill: 'purple', class: 'surfaceClass1', opacity: 0.1}})
  svg.call(plot)

  plot.draw()

  setTimeout(() => {
    let surface = window.d3.select('.surface0')
    test.equal(surface.attr('opacity'), '0.1')
    test.equal(surface.attr('class'), 'surface0 surfaceClass1')

    // Should default to plotting 40401 polygons with default zoom, scale, and origin
    test.equal(window.d3.selectAll('.surface0').size(), 40401)
  }, 3000)

  test.end()
})
