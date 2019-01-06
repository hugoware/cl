
// make sure code is in a valid format
$define('verifyObjectSyntax', () => {
  
  const code = $getFile('/main.ts', { trim: false });
  const error = $codeValidator(code, test => test
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
    .symbol(';')
    .end());

  // check for errors
  if (error) {
    $showHint(error.error, error);
    return error;
  }
  else {
    $hideHint();
  }
  
});


// checks the code execution
$define('verifyObject', ({ runner, code }) => {

  // if not correct syntax, 
  const error = $self.verifyObjectSyntax();
  if (error) {
    $speakMessage('You still have some syntax errors to fix before running this code');
    return;
  }

  // execute and test the code
  runner.run(code, {

    onEnd: () => {

      const a = runner.interpreter.get('a');
      if (a !== 300) {
        if (_.isNil(a))
          $speakMessage('You need to declare a variable `"a"` with a number value of `300`');
        else if (!_.isNumber(a))
          $speakMessage('The variable `"a"` should be the number `300`');
        else $speakMessage('The variable `"a"` should be `300`, but the variable you declared equals to `' + a + '`', 'surprised');
        return;
      }

      const b = runner.interpreter.get('b');
      if (b !== false) {
        if (_.isNil(b))
          $speakMessage('You need to declare a variable `"b"` with a boolean value of `false`');
        else if (!_.isBoolean(b))
          $speakMessage('The variable `"b"` should be the boolean `false`');
        else $speakMessage('The variable `"b"` should be `false`, but the variable you declared equals to `' + b + '`', 'surprised');
        return;
      }

      const c = runner.interpreter.get('c');
      if (c !== 'hello') {
        if (_.isNil(c))
          $speakMessage('You need to declare a variable `"c"` with a string value of `hello`');
        else if (!_.isString(c))
          $speakMessage('The variable `"c"` should be the string `hello`');
        else $speakMessage('The variable `"c"` should be `hello`, but the variable you declared equals to `' + c + '`', 'surprised');
        return;
      }


      // console.log('finished');
      // console.log(runner);
      // 
      $speakMessage('looks great!');

    }

  });

});
