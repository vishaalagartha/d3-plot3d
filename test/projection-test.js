let tape = require('tape'),
    JSDOM = require('jsdom').JSDOM
    d3 = require('d3'),
    _d3 = require('../')

tape('test projection', function(test) {
  const window = (new JSDOM(`<html><head></head><body></body></html>`, { pretendToBeVisual: true })).window;

  window.d3 = d3.select(window.document)

  let svg = window.d3.select('body')
                  .append('svg')
                  .attr('xmlns', 'http://www.w3.org/2000/svg')
                  .attr('width', 512)
                  .attr('height', 512)

  let plot = _d3.plot3d()
                .plot({type: 'point', data: [{x: 0, y: 0, z:0}], attributes: {class: 'point1'}})
                .plot({type: 'point', data: [{x: 10, y: 0, z:0}], attributes: {class: 'point2'}})
                .plot({type: 'point', data: [{x: 0, y: 10, z:0}], attributes: {class: 'point3'}})
                .plot({type: 'point', data: [{x: 0, y: 0, z:10}], attributes: {class: 'point4'}})
  svg.call(plot)

  plot.draw()

  setTimeout(() => {
    let point1 = window.d3.select('.point1')

    test.equal(point1.attr('cx'), '0')
    test.equal(point1.attr('cy'), '0')

    let point2 = window.d3.select('.point2')

    // point2 should appear bottom left of point1
    test.ok(point2.attr('cx') < point1.attr('cx'))
    test.ok(point2.attr('cy') > point1.attr('cy'))
     
    let point3 = window.d3.select('.point3')

    // point2 should appear bottom right of point1
    test.ok(point3.attr('cx') > point1.attr('cx'))
    test.ok(point3.attr('cy') > point1.attr('cy'))

    let point4 = window.d3.select('.point4')

    // point4 should above of point1
    test.ok(point4.attr('cx')===point1.attr('cx'))
    test.ok(point4.attr('cy') < point1.attr('cy'))
  }, 3000)

  test.end()
})
