let tape = require('tape'),
    JSDOM = require('jsdom').JSDOM
    d3 = require('d3'),
    _d3 = require('../')

tape('test point plotting', function(test) {
  const window = (new JSDOM(`<html><head></head><body></body></html>`, { pretendToBeVisual: true })).window;

  window.d3 = d3.select(window.document)

  let svg = window.d3.select('body')
                  .append('svg')
                  .attr('xmlns', 'http://www.w3.org/2000/svg')
                  .attr('width', 512)
                  .attr('height', 512)

  let plot = _d3.plot3d()
               .plot({type: 'point', data: [{x: 0, y: 0, z: 0}], attributes: {fill: 'yellow', radius: 19, class: 'circleClass1'}})
               .plot({type: 'point', data: [{x: 10, y: 0, z: 0}], attributes: {fill: 'blue', radius: 30, class: 'circleClass2'}})
               .plot({type: 'point', data: [{x: 10, y: 40, z: 0}], attributes: {fill: 'green', radius: 1, class: 'circleClass3'}})
  svg.call(plot)

  plot.draw()

  let circles = window.d3.selectAll('circle')
  test.equal(circles.size(), 3)

  setTimeout(() => {
    let oneCircle = window.d3.select('circle')
    test.equal(oneCircle.attr('fill'), 'rgb(255, 255, 0)')
    test.equal(oneCircle.attr('r'), '19')
    test.equal(oneCircle.attr('class'), 'data circleClass1')
  }, 3000)

  test.end()
})
