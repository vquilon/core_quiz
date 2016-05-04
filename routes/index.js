var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

//Autolad de rutas que usen :quizId
router.param('quizId',quizController.load);//autoload :quizId

//Definicion d erutas de /quizzes
router.get('/quizzes',quizController.index);
router.get('/quizzes/:quizId(\\d+)',quizController.show);
router.get('/quizzes/:quizId(\\d+)/check',quizController.check);
//Definición de rutas de /author
router.get('/author', quizController.author);

module.exports = router;
