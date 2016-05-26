var express = require('express');
var router = express.Router();
var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

//Autolad de rutas que usen :quizId
router.param('quizId',quizController.load);//autoload :quizId

router.param('format',quizController.formatos);//autoload :quizId

//Definicion d erutas de /quizzes
router.get('/quizzes.:format?',quizController.index);//modificar para json
router.get('/quizzes/:quizId(\\d+).:format?',quizController.show);//modificar para json
router.get('/quizzes/:quizId(\\d+)/check',quizController.check);
router.get('/quizzes/new',quizController.new);
router.post('/quizzes',quizController.create);
router.get('/quizzes/:quizId(\\d+)/edit',quizController.edit);
router.put('/quizzes/:quizId(\\d+)',quizController.update);
router.delete('/quizzes/:quizId(\\d+)',quizController.destroy);
//Definición de rutas de /author
router.get('/author', quizController.author);

router.get('/quizzes/:quizId(\\d+)/comments/new',commentController.new);
router.post('/quizzes/:quizId(\\d+)/comments',commentController.create);


//Definicion de rutas de busqueda /search
//router.get('/find',quizController.search);
module.exports = router;
