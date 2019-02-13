
// checks the logged values
const syntax_verifyLog = test => {
  const variableOrder = [ ];

  // adds a result value
  test.includeResult({ variableOrder });

  // checks if a variable has already been logged
  function checkIfVariableUsed(id) {
    if (_.includes(variableOrder, id)) {
      const allowed = _.difference(['a', 'b', 'c'], variableOrder);
      const vars = _.map(allowed, id => `\`${id}\``);
      const phrase = $oxford(vars, 'or');
      return `Expected ${phrase}`;
    }

    variableOrder.push(id);
  }

  // test for the required logs
  test.newline()
    .id('console')
    .symbol('.')
    .id('log')
    .symbol('(')
    .id('a', 'b', 'c', checkIfVariableUsed)
    .symbol(')')
    .symbol(';')
    .newline()

    .id('console')
    .symbol('.')
    .id('log')
    .symbol('(')
    .id('a', 'b', 'c', checkIfVariableUsed)
    .symbol(')')
    .symbol(';')
    .newline()
    
    .id('console')
    .symbol('.')
    .id('log')
    .symbol('(')
    .id('a', 'b', 'c', checkIfVariableUsed)
    .symbol(')')
    .symbol(';');
}

// make sure code is in a valid format
$define('verifyLogSyntax', () => {
  const code = $getFile('/main.ts', { trim: false });
  const result = $validateCode(code, syntax_verifyObject, syntax_verifyLog);
  
  // check for errors
  if (result.error)
    $showHint(result.error.message, result.error);
  else $hideHint();
  return result;
});


// checks the code execution
$define('verifyLog', ({ runner, code, onSuccess }) => {

  // execute and test the code
  runner.run(code, {

    onError: $speakMessage.EXECUTION_ERROR,

    onEnd: () => {
      let hasA, hasB, hasC, hasMismatch;

      // check each variable
      _.each([ 'a', 'b', 'c' ], (name, i) => {

        // stop if there's already an error
        if (hasMismatch) return;

        // compare the values
        const logged = runner.getOutput(i + 1, 0);
        if (name === 'a') {
          hasA = true;
          if (logged !== 300) {
            hasMismatch = true;
            $speakMessage('Expected `a` to be logged as `300`', 'sad');
          }
        }
        else if (name === 'b') {
          hasB = true;
          if (logged !== false) {
            hasMismatch = true;
            $speakMessage('Expected `b` to be logged as `false`', 'sad');
          }
        }
        else if (name === 'c') {
          hasC = true;
          if (logged !== 'hello') {
            hasMismatch = true;
            $speakMessage('Expected `c` to be logged as `hello`', 'sad');
          }
        }
      });

      // there was a result error
      if (hasMismatch) return;

      // make sure all variables were used
      if (!(hasA && hasB && hasC))
        return $speakMessage("Seems like you're missing a few variables", 'sad');

      // check the syntax
      const syntax = $self.verifyLogSyntax();
      if (syntax.error)
        return $speakMessage.MATCH_EXAMPLE();
      

      // success
      $speakMessage('That looks great! You can see your values printed in the output area on the right');
      onSuccess();

    }

  });

});
