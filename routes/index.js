var express = require('express');
var router = express.Router();
var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var userController = require('../controllers/user_controller');
var sessionController = require('../controllers/session_controller');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

//Autolad de rutas que usen :quizId
router.param('quizId',quizController.load);//autoload :quizId
router.param('userId',userController.load);//autoload :userId
router.param('commentId',commentController.load);
router.param('format',quizController.formatos);//autoload :quizId

//Definicion de rutas de sesion
router.get('/session',sessionController.new);//formulario login
router.post('/session',sessionController.create);//crear sesion
router.delete('/session',sessionController.destroy);//destruir sesion

//Definicion de rutas de cuenta
router.get('/users',userController.index);
router.get('/users/:userId(\\d+)',userController.show);
router.get('/users/new',userController.new);
router.post('/users',userController.create);
router.get('/users/:userId(\\d+)/edit',sessionController.loginRequired,userController.edit);
router.put('/users/:userId(\\d+)',sessionController.loginRequired,userController.update);
router.delete('/users/:userId(\\d+)',sessionController.loginRequired,userController.destroy);

//Definicion de rutas de /quizzes
router.get('/quizzes.:format?',quizController.index);//modificar para json
router.get('/quizzes/:quizId(\\d+).:format?',quizController.show);//modificar para json
router.get('/quizzes/:quizId(\\d+)/check',quizController.check);
router.get('/quizzes/new',sessionController.loginRequired,quizController.new);
router.post('/quizzes',sessionController.loginRequired,quizController.create);
router.get('/quizzes/:quizId(\\d+)/edit',sessionController.loginRequired,quizController.edit);
router.put('/quizzes/:quizId(\\d+)',sessionController.loginRequired,quizController.update);
router.delete('/quizzes/:quizId(\\d+)',sessionController.loginRequired,quizController.destroy);

//Definición de rutas de /author
router.get('/author', quizController.author);

//Definicion de rutas de comentarios
router.get('/quizzes/:quizId(\\d+)/comments/new',sessionController.loginRequired,commentController.new);
router.post('/quizzes/:quizId(\\d+)/comments',sessionController.loginRequired,commentController.create);
router.put('/quizzes/:quizId(\\d+)/comments/:commentId(\\d+)/accept',sessionController.loginRequired,commentController.accept);

//Definicion de rutas de busqueda /search
//router.get('/find',quizController.search);
module.exports = router;
