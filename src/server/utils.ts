import {Error} from '../client/app/models/error';
const jwt = require('jsonwebtoken');

export abstract class StatusMessages {
  public static _400 = {title: 'Bad Request', message: 'Unacceptable request.'};
  public static _401 = {title: 'Unauthorized', message: 'Invalid Credentials.'};
  public static _403 = {title: 'Forbidden', message: 'Missing required permissions.'};
  public static _498 = {title: 'Invalid token', message: 'Missing or expired token'};
  public static _500 = {title: 'Internal Server Error', message: 'Error occurred.'};
}

export function hasValidToken(req, res, next) {
  // check header or url parameters or post parameters for token
  const token = req.body.token || req.query.token || req.headers.authorization;
  // decode token
  if (token) {
    jwt.verify(token, 'secret', function(err, decoded) {
      if (err) { return res.status(498).send(new Error(StatusMessages._403));
      } else {
        req['decoded'] = decoded;
        next();
      }
    });
  } else { return res.status(498).send(new Error(StatusMessages._498)); }
}

export function checkBody(req, res, next) {
  if (Object.keys(req.body).length === 0) { return res.status(400).send(new Error(StatusMessages._400)); }
  next();
}

export function checkUser(req, res, next) {
  if (!req.body.user) { return res.status(400).send(new Error(StatusMessages._400)); }
  next();
}
export function checkAccount(req, res, next) {
  if (!req.body.account || (!req.body.account.email || !req.body.account.password)) {
    return res.status(401).send(new Error(StatusMessages._401));
  }
  next();
}
