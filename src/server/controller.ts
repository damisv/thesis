import * as express from 'express';

const controller = ({config}) => {

  const router = express.Router();

  // test
  router.get('/ping', (req, res) => {
    res.status(200).send('pong');
  });
  return router;
};

export {controller};
