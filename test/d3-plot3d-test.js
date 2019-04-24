var tape = require('tape'),
    JSDOM = require('jsdom').JSDOM,
    d3 = require('../');

global.document = new JSDOM('<html><body><svg width="1084" height="1064" id="testSVG"></svg></body></html>');

tape('constructor exists', function(test) {
  test.equal(typeof d3.plot3d(), 'function');
  test.end();
});
