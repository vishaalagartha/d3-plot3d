let tape = require('tape'),
    JSDOM = require('jsdom').JSDOM
    d3 = require('d3'),
    _d3 = require('../')


tape('constructor creates plot and zoom buttons', function(test) {
  test.equal(typeof _d3.plot3d(), 'function')

  const window = (new JSDOM(`<html><head></head><body></body></html>`, { pretendToBeVisual: true })).window;

  window.d3 = d3.select(window.document)

  let svg = window.d3.select('body')
                  .append('svg')
                  .attr('xmlns', 'http://www.w3.org/2000/svg')
                  .attr('width', 512)
                  .attr('height', 512)

  let plot = _d3.plot3d()
  svg.call(plot)
  let plotDOM = window.d3.select('.plot3d')

  test.equal(typeof plotDOM, 'object')

  let zoomButtons = window.d3.selectAll('rect')

  test.equal(zoomButtons.size(), 2)

  test.end()
})
