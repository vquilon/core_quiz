var models = require('../models');

//Autoload el quiz asociado a :quizId
exports.load = function(req, res, next, quizId){
	models.Quiz.findById(quizId).then(function(quiz){
		if(quiz){//si encuentra es true
			req.quiz = quiz;
			next();
		}
		else{
			next(new Error('No existe quizId='+quizId));
		}
	}).catch(function(error){next(error);});
};

//GET /quizzes.:format?
exports.formatos = function(req,res,next,format){
		console.log("formato "+format);
		req.format = format;
		next();
};


//GET /quizzes
exports.index = function(req, res, next) {
	var search_blank = req.query.search || "";
	var search=search_blank.replace(/ /g,"%");

	//NUEVO
	var formato=req.format || "";


	if(search_blank===""){
		search="Todos los quizzes";

		if(formato==="html"||formato===""){
			models.Quiz.findAll().then(function(quizzes){
				res.render('quizzes/index', {quizzes:quizzes,search:search});	
			}).catch(function(error){next(error);});
		}else{
			if(formato==="json"){
			models.Quiz.findAll().then(function(quizzes){
				var cadena='[';
				var long=0;
				for(var j in quizzes){
					long++;
				}
				for(var i in quizzes){
					cadena=cadena+'{ "id": '+quizzes[i].id+',"question": "'+quizzes[i].question+'","answer": "'+quizzes[i].answer+'" }';
					if(i<long-1){
						cadena=cadena+',';
					}
				}
				cadena=cadena+']';
				var obj = JSON.parse(cadena);
				res.json(obj);	
			}).catch(function(error){next(error);});
			}else{
				res.send("Formato no aceptado "+formato);
			}

		}
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

	var formato=req.format || "";

	if(formato==="html"||formato===""){
		res.render('quizzes/show',{quiz:req.quiz,answer:answer});	
	}else{
		if(formato==="json"){
			var cadena="";
			cadena='{ "id": '+req.quiz.id+',"question": "'+req.quiz.question+'","answer": "'+req.quiz.answer+'" }';
			var obj = JSON.parse(cadena);
			res.json(obj);
		}else{
			res.send("Formato no aceptado "+formato);
		}

	}
	
		
};

//GET /quizzes/:id/check
exports.check = function(req, res, next){
	var answer= req.query.answer || "";
	var result = answer === req.quiz.answer ? 'Correcta' : 'Incorrecta';
	res.render('quizzes/result', {quiz:req.quiz,result:result, answer: answer});
};

/*exports.search = function(req, res, next){
	var search_blank = req.query.search || "";
	var search=search_blank.replace(/ /g,"%");
	search ="%"+search+"%";
	models.Quiz.findAll({where: {question: {$like: search}}}).then(function(list){
		res.render('quizzes/search',{search:search_blank,list:list});
	}).catch(function(error){next(error);});

};*/

exports.author = function(req, res, next){
	res.render('quizzes/author');
};

//GET /quizzes/new
exports.new = function(req, res, next){
	var quiz = models.Quiz.build({question: "", answer: ""});
	res.render('quizzes/new',{quiz:quiz});
};
//POST /quizzes/create
exports.create = function(req, res, next){
	var quiz=models.Quiz.build({question : req.body.quiz.question,answer:req.body.quiz.answer});
//guarda en DB los campos pregunta y respuesta de quiz
	quiz.save({fields: ["question","answer"]}).then(function(quiz){
		res.redirect('/quizzes');
	}).catch(function(error){
		next(error);
	});
};