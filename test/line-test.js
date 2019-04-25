let tape = require('tape'),
    JSDOM = require('jsdom').JSDOM
    d3 = require('d3'),
    _d3 = require('../')

tape('test line plotting', function(test) {
  const window = (new JSDOM(`<html><head></head><body></body></html>`, { pretendToBeVisual: true })).window;

  window.d3 = d3.select(window.document)

  let svg = window.d3.select('body')
                  .append('svg')
                  .attr('xmlns', 'http://www.w3.org/2000/svg')
                  .attr('width', 512)
                  .attr('height', 512)

  let plot = _d3.plot3d()
               .plot({type: 'line', data: [{x: 0, y: 0, z: 0}, {x: 1, y: 2, z: 3}], attributes: {stroke: 'grey', stroke_width: 10, class: 'lineClass1'}})
               .plot({type: 'line', data: [{x: 10, y: 0, z: 0}, {x: 0, y: 100, z: 5}], attributes: {stroke: 'blue', stroke_width: 0.2, class: 'lineClass2'}})
               .plot({type: 'line', data: [{x: 10, y: 40, z: 0}, {x: 0, y: 10, z: 100}], attributes: {stroke: 'green', stroke_width: 0.1, class: 'lineClass3'}})
  svg.call(plot)

  plot.draw()

  let lines = window.d3.selectAll('line')
  test.equal(lines.size(), 3)

  setTimeout(() => {
    let oneLine = window.d3.select('line')
    test.equal(oneLine.attr('stroke'), 'rgb(128, 128, 128)')
    test.equal(oneLine.attr('stroke-width'), '10')
    test.equal(oneLine.attr('class'), 'data lineClass1')
  }, 3000)

  test.end()
})
