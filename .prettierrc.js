const fabric = require('@umijs/fabric');

module.exports = {
  ...fabric.prettier,
  arrowParens: 'avoid',
  jsxsingleQuote: true,
};
