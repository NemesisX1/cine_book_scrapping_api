import express from 'express';
const router = express.Router();

/* GET home page. */
router.get('/', function (_req, res, _next) {
  
  /* 
     #swagger.tags = ['/']

     #swagger.summary = ''

     #swagger.description = ''

     #swagger.responses[200] = {
      description: 'OK'
     }

  */
  
  res.render('index', { title: 'Welcome to the unofficial Canal Olympia API' });
});

export default router;
