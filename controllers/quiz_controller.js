var models = require('../models');

//Autoload el quiz asociado a :quizId
exports.load = function(req, res, next, quizId){
	models.Quiz.findById(quizId).then(function(quiz){
		if(quiz){
			req.quiz = quiz;
			next();
		}
		else{
			next(new Error('No existe quizId='+quizId));
		}
	}).catch(function(error){next(error);});
};


//GET /quizzes
exports.index = function(req, res, next) {
	var search_blank = req.query.search || "";
	var search=search_blank.replace(/ /g,"%");

	if(search_blank===""){
		search="Todos los quizzes";
		models.Quiz.findAll().then(function(quizzes){
			res.render('quizzes/index', {quizzes:quizzes,search:search});	
		}).catch(function(error){next(error);});

	}
	else{
	search ="%"+search+"%";
	search_blank="Resultados de la búsqueda "+'"'+search_blank+'"';
	models.Quiz.findAll({where: {question: {$like: search}}}).then(function(quizzes){
		res.render('quizzes/index',{search:search_blank,quizzes:quizzes});
	}).catch(function(error){next(error);});
	}
};

//Get /quizzes/:id
exports.show = function(req, res, next){
	var answer= req.query.answer || "";
	res.render('quizzes/show',{quiz:req.quiz,answer:answer});
		
};

//GET /quizzes/:id/check
exports.check = function(req, res, next){
	var answer= req.query.answer || "";
	var result = answer === req.quiz.answer ? 'Correcta' : 'Incorrecta';
	res.render('quizzes/result', {quiz:req.quiz,result:result, answer: answer});
};

exports.search = function(req, res, next){
	var search_blank = req.query.search || "";
	var search=search_blank.replace(/ /g,"%");
	search ="%"+search+"%";
	models.Quiz.findAll({where: {question: {$like: search}}}).then(function(list){
		res.render('quizzes/search',{search:search_blank,list:list});
	}).catch(function(error){next(error);});

};

exports.author = function(req, res, next){
	res.render('quizzes/author');
};