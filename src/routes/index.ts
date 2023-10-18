import express from 'express';
const router = express.Router();

/* GET home page. */
router.get('/', function (_req, res, _next) {
  
  // #swagger.tags = ['/']
  
  res.render('index', { title: 'Express' });
});

export default router;
