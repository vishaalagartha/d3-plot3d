var tape = require("tape"),
    d3 = require("../");

tape("foo() returns the answer to the ultimate question of life, the universe, and everything.", function(test) {
  var f = d3.plot3d()
  test.equal(f.foo(), 42);
  test.end();
});
