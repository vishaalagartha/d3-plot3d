let tape = require('tape'),
    JSDOM = require('jsdom').JSDOM
    d3 = require('d3'),
    _d3 = require('../')

tape('test polygon plotting', function(test) {
  const window = (new JSDOM(`<html><head></head><body></body></html>`, { pretendToBeVisual: true })).window;

  window.d3 = d3.select(window.document)

  let svg = window.d3.select('body')
                  .append('svg')
                  .attr('xmlns', 'http://www.w3.org/2000/svg')
                  .attr('width', 512)
                  .attr('height', 512)

  let plot = _d3.plot3d()
               .plot({type: 'polygon', data: [{x: 0, y: 0, z: 0}, {x: 1, y: 2, z: 3}, {x: 3, y: 50, z: 0}], attributes: {fill: 'orange', opacity: 0.1, class: 'polygonClass1'}})
               .plot({type: 'polygon', data: [{x: 10, y: 20, z: 30}, {x: 5, y: 0, z: 0}, {x: 10, y: 40, z: 0}, {x: 0, y: 10, z: 100}], attributes: {fill: 'green', class: 'polygonClass2'}})
  svg.call(plot)

  plot.draw()

  let polygons = window.d3.selectAll('polygon')
  test.equal(polygons.size(), 2)


  setTimeout(() => {
    let onePolygon = window.d3.select('polygon')
    test.equal(onePolygon.attr('fill'), 'rgb(255, 165, 0)')
    test.equal(onePolygon.attr('opacity'), '0.1')
    test.equal(onePolygon.attr('class'), 'data polygonClass1')
  }, 3000)

  test.end()
})
