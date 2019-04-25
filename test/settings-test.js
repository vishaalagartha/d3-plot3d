let tape = require('tape'),
    JSDOM = require('jsdom').JSDOM
    d3 = require('d3'),
    _d3 = require('../')

tape('test scale', function(test) {
  const window = (new JSDOM(`<html><head></head><body></body></html>`, { pretendToBeVisual: true })).window;

  window.d3 = d3.select(window.document)

  let svg = window.d3.select('body')
                  .append('svg')
                  .attr('xmlns', 'http://www.w3.org/2000/svg')
                  .attr('width', 512)
                  .attr('height', 512)

  let plot = _d3.plot3d()
                .scale({scale: 1})
                .plot({type: 'point', data: [{x: 1000, y:0, z:0}], attributes: {class: 'point1'}})

  let expectedCx = -416.1468365471424,
      expectedCy = 557.5055758429057

  svg.call(plot)

  plot.draw()

  setTimeout(() => {
    let point = window.d3.select('.point1')

    test.equal(parseFloat(point.attr('cx')), expectedCx)
    test.equal(parseFloat(point.attr('cy')), expectedCy)
    plot.scale({scale: 100})
         .plot({type: 'point', data: [{x: 1000, y:0, z:0}], attributes: {class: 'point2'}})

    plot.draw()
    setTimeout(() => {
      point = window.d3.select('.point2')

      // Should be 100x bigger with updated scale
      expectedCx = -41614.68365471424
      expectedCy = 55750.557584290575
      test.equal(parseFloat(point.attr('cx')), expectedCx)
      test.equal(parseFloat(point.attr('cy')), expectedCy)
    }, 3000)
  }, 3000)

  test.end()
})

tape('test origin', function(test) {
  const window = (new JSDOM(`<html><head></head><body></body></html>`, { pretendToBeVisual: true })).window;

  window.d3 = d3.select(window.document)

  let svg = window.d3.select('body')
                  .append('svg')
                  .attr('xmlns', 'http://www.w3.org/2000/svg')
                  .attr('width', 512)
                  .attr('height', 512)

  let plot = _d3.plot3d()
                .origin({origin: {x: 100, y: 0, z:0}})
                .plot({type: 'point', data: [{x: 100, y:0, z:0}], attributes: {class: 'point1'}})
                .plot({type: 'point', data: [{x: 0, y:0, z:0}], attributes: {class: 'point2'}})

  svg.call(plot)

  plot.draw()

  setTimeout(() => {
    let point1 = window.d3.select('.point1')

    //point1 should show up at origin
    test.equal(parseFloat(point1.attr('cx')), 0)
    test.equal(parseFloat(point1.attr('cy')), 0)

    let point2 = window.d3.select('.point2')

    //point2 should show up top right of origin
    test.ok(point2.attr('cx') > point1.attr('cx'))
    test.ok(point2.attr('cy') < point1.attr('cy'))
  }, 3000)

  test.end()
})

tape('test rotation', function(test) {
  const window = (new JSDOM(`<html><head></head><body></body></html>`, { pretendToBeVisual: true })).window;

  window.d3 = d3.select(window.document)

  let svg = window.d3.select('body')
                  .append('svg')
                  .attr('xmlns', 'http://www.w3.org/2000/svg')
                  .attr('width', 512)
                  .attr('height', 512)

  let plot = _d3.plot3d()
                .rotation({yaw: 0, pitch: 0, roll: 0})
                .plot({type: 'point', data: [{x: 1, y:0, z:0}], attributes: {class: 'point1'}})
                .plot({type: 'point', data: [{x: 0, y:0, z:1}], attributes: {class: 'point2'}})

  svg.call(plot)

  plot.draw()

  setTimeout(() => {
    let point1 = window.d3.select('.point1')

    //point1 should show up completely to right
    test.equal(parseFloat(point1.attr('cx')), 100)
    test.equal(parseFloat(point1.attr('cy')), 0)

    let point2 = window.d3.select('.point2')

    //point2 should show up directly above point1
    test.equal(parseFloat(point1.attr('cx')), 100)
    test.equal(parseFloat(point1.attr('cy')), 0)
  }, 3000)

  test.end()
})
