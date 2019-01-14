
// require variables
const syntax_verifyObject = test => test
  .declare('const')
  .id('a')
  .symbol('=')
  .num(300)
  .symbol(';')
  .newline()

  .declare('const')
  .id('b')
  .symbol('=')
  .bool(false)
  .symbol(';')
  .newline()
  
  .declare('const')
  .id('c')
  .symbol('=')
  .str('hello')
  .symbol(';');


// make sure code is in a valid format
$define('verifyObjectSyntax', () => {  
  const code = $getFile('/main.ts', { trim: false });
  const result = $validateCode(code, syntax_verifyObject);

  // check for errors
  if (result.error)
    $showHint(result.error.message, result.error);
  else $hideHint();
  return result;
});


// checks the code execution
$define('verifyObject', ({ runner, code, onSuccess }) => {


  // execute and test the code
  runner.run(code, {
    onError: $speakMessage.EXECUTION_ERROR,

    onEnd: () => {

      const a = runner.interpreter.get('a');
      if (a !== 300) {
        if (_.isNil(a))
          $speakMessage('You need to declare a variable `a` with a number value of `300`');
        else if (!_.isNumber(a))
          $speakMessage('The variable `a` should be the number `300`');
        else $speakMessage('The variable `a` should be `300`, but the variable you declared equals to `' + a + '`', 'surprised');
        return;
      }

      const b = runner.interpreter.get('b');
      if (b !== false) {
        if (_.isNil(b))
          $speakMessage('You need to declare a variable `b` with a boolean value of `false`');
        else if (!_.isBoolean(b))
          $speakMessage('The variable `b` should be the boolean `false`');
        else $speakMessage('The variable `b` should be `false`, but the variable you declared equals to `' + b + '`', 'surprised');
        return;
      }

      const c = runner.interpreter.get('c');
      if (c !== 'hello') {
        if (_.isNil(c))
          $speakMessage('You need to declare a variable `c` with a string value of `hello`');
        else if (!_.isString(c))
          $speakMessage('The variable `c` should be the string `hello`');
        else $speakMessage('The variable `c` should be `hello`, but the variable you declared equals to `' + c + '`', 'surprised');
        return;
      }
      
      // since the values are all correct, we also should check
      // that the code is entered correctly
      const syntax = $self.verifyObjectSyntax();
      if (syntax.error)
        return $speakMessage.MATCH_EXAMPLE();

      // notify the success
      $speakMessage('looks great!');
      onSuccess();

    }

  });

});
