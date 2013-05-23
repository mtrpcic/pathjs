var assertions = buster.assertions,
    assert = assertions.assert,
    refute = assertions.refute,
    selector_console = "div#actual";

exports.name = "Simple Test";
exports.tests = [
  {
    name: "checks the following routes: root -> #A -> #B -> #C -> #D1 -> #D2 -> #E/params/1/parse -> #E/params/2/parse -> #E/params/3/check -> #F -> #G -> #H -> #H/10 -> #H/10/20",
    func: function(done) {
      exports.driver
      .execute("return ''+location.protocol + '//' +location.host + location.pathname", null, function(error, result) {

        var host = result.value;

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
        .url( host+"#B" )
        .getText(selector_console, function(error, text){
          assert.equals( text, 'F[enter]::F[action]::A[enter]::A[action]::A[exit]::B[enter]::B[action]' );
        })
        .url( host+"#C" )
        .getText(selector_console, function(error, text){
          assert.equals( text, 'F[enter]::F[action]::A[enter]::A[action]::A[exit]::B[enter]::B[action]::C[action]' );
        })
        .url( host+"#D1" )
        .getText(selector_console, function(error, text){
          assert.equals( text, 'F[enter]::F[action]::A[enter]::A[action]::A[exit]::B[enter]::B[action]::C[action]::C[exit]::RESCUE' );
        })
        .url( host+"#D2" )
        .getText(selector_console, function(error, text){
          assert.equals( text, 'F[enter]::F[action]::A[enter]::A[action]::A[exit]::B[enter]::B[action]::C[action]::C[exit]::RESCUE::RESCUE' );
        })
        .url( host+"#E/params/1/parse" )
        .getText(selector_console, function(error, text){
          assert.equals( text, 'F[enter]::F[action]::A[enter]::A[action]::A[exit]::B[enter]::B[action]::C[action]::C[exit]::RESCUE::RESCUE::E[enter](parse id=1)::E[action](parse id=1)' );
        })
        .url( host+"#E/params/2/parse" )
        .getText(selector_console, function(error, text){
          assert.equals( text, 'F[enter]::F[action]::A[enter]::A[action]::A[exit]::B[enter]::B[action]::C[action]::C[exit]::RESCUE::RESCUE::E[enter](parse id=1)::E[action](parse id=1)::E[enter](parse id=2)::E[action](parse id=2)' );
        })
        .url( host+"#E/params/3/check" )
        .getText(selector_console, function(error, text){
          assert.equals( text, 'F[enter]::F[action]::A[enter]::A[action]::A[exit]::B[enter]::B[action]::C[action]::C[exit]::RESCUE::RESCUE::E[enter](parse id=1)::E[action](parse id=1)::E[enter](parse id=2)::E[action](parse id=2)::E[action](check id=3)' );
        })
        .url( host+"#F" )
        .getText(selector_console, function(error, text){
          assert.equals( text, 'F[enter]::F[action]::A[enter]::A[action]::A[exit]::B[enter]::B[action]::C[action]::C[exit]::RESCUE::RESCUE::E[enter](parse id=1)::E[action](parse id=1)::E[enter](parse id=2)::E[action](parse id=2)::E[action](check id=3)::E[exit](check id=3)::F[enter]::F[action]' );
        })
        .url( host+"#G" )
        .getText(selector_console, function(error, text){
          assert.equals( text, 'F[enter]::F[action]::A[enter]::A[action]::A[exit]::B[enter]::B[action]::C[action]::C[exit]::RESCUE::RESCUE::E[enter](parse id=1)::E[action](parse id=1)::E[enter](parse id=2)::E[action](parse id=2)::E[action](check id=3)::E[exit](check id=3)::F[enter]::F[action]::G[enter 1]::G[enter 2]::G[enter 3]::G[enter 4]' );
        })
        .url( host+"#H" )
        .getText(selector_console, function(error, text){
          assert.equals( text, 'F[enter]::F[action]::A[enter]::A[action]::A[exit]::B[enter]::B[action]::C[action]::C[exit]::RESCUE::RESCUE::E[enter](parse id=1)::E[action](parse id=1)::E[enter](parse id=2)::E[action](parse id=2)::E[action](check id=3)::E[exit](check id=3)::F[enter]::F[action]::G[enter 1]::G[enter 2]::G[enter 3]::G[enter 4]::H(one=N/A, two=N/A)' );
        })
        .url( host+"#H/10" )
        .getText(selector_console, function(error, text){
          assert.equals( text, 'F[enter]::F[action]::A[enter]::A[action]::A[exit]::B[enter]::B[action]::C[action]::C[exit]::RESCUE::RESCUE::E[enter](parse id=1)::E[action](parse id=1)::E[enter](parse id=2)::E[action](parse id=2)::E[action](check id=3)::E[exit](check id=3)::F[enter]::F[action]::G[enter 1]::G[enter 2]::G[enter 3]::G[enter 4]::H(one=N/A, two=N/A)::H(one=10, two=N/A)' );
        })
        .url( host+"#H/10/20" )
        .getText(selector_console, function(error, text){
          assert.equals( text, 'F[enter]::F[action]::A[enter]::A[action]::A[exit]::B[enter]::B[action]::C[action]::C[exit]::RESCUE::RESCUE::E[enter](parse id=1)::E[action](parse id=1)::E[enter](parse id=2)::E[action](parse id=2)::E[action](check id=3)::E[exit](check id=3)::F[enter]::F[action]::G[enter 1]::G[enter 2]::G[enter 3]::G[enter 4]::H(one=N/A, two=N/A)::H(one=10, two=N/A)::H(one=10, two=20)' );
        })
        .end(done);

      });
    }
  }
];
