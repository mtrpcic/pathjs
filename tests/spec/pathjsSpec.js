var assertions = buster.assertions,
    assert = assertions.assert,
    refute = assertions.refute,
    host   = "http://localhost:9001/tests/path.js.test.html",
    selector_console = "div#actual";

exports.name = "Simple Test";
exports.tests = [
  {
    name: "checks the following routes: root -> #A",
    func: function(done) {
      exports.driver
      .getTitle(function(error, title) {
        assert.equals( title, 'PathJS Test' );
      })
      .getText(selector_console, function(error, text){
        assert.equals( text, 'F[enter]::F[action]' );
      })
      .url( host+"#A" )
      .getText(selector_console, function(error, text){
        assert.equals( text, 'F[enter]::F[action]::A[enter]::A[action]' );
      })
      .end(done);
    }
  }
];
