// This file contains a linting error that should block the commit
function anotherBadFunction() {
  // Unused variable should be caught by the linter
  const unusedVariable = 'This will cause a linting error';
  return 'test';
}

export default anotherBadFunction;
