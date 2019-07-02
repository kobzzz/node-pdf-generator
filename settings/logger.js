const morgan = require('morgan');
const { error, success, info } = require('./chalk');

module.exports = morgan((tokens, req, res) => [
    info(tokens.method(req, res)),
    tokens.url(req, res),
    res.statusCode >= 400 ? error(tokens.status(req, res)) : success(tokens.status(req, res)),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
);
