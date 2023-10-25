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
  
    return res.render('index', { title: 'Welcome to the unofficial Canal Olympia API' });
});


router.get('/status', function (_req, res, _next) {

   /* 
     #swagger.tags = ['/']

     #swagger.summary = 'Redirect to the health status page'

   */

    return res.redirect('https://canalolympiascrappingapi.betteruptime.com')
})


export default router;
