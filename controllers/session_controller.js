var models = require('../models');
var Sequelize = require('sequelize');
var url = require('url');

var authenticate = function(login, password){
	return models.User.findOne({where: {username: login}}).then(function(user){
		if(user && user.verifyPassword(password)){
			return user;
		}else{
			return null;
		}
	});
};

//GET /session --Formulario de login
exports.new = function(req, res, next){
	var redir = req.query.redir || url.parse(req.headers.referer || "/").pathname;
	
	if(redir === '/session' || redir === '/users/new'){
		redir = "/";
	}

	res.render('session/new', {redir: redir});
};
//POST /session -- Crear sesion
exports.create = function(req, res, next){
	var redir = req.body.redir || '/';
	var login = req.body.login;
	var password = req.body.password;

	authenticate(login, password).then(function(user){
		if(user){      
			var datems= new Date().getTime();            
			req.session.user = {id:user.id, username:user.username, expiredAt:datems};
			res.redirect(redir);//redireccion a redir
		}else{
			req.flash('error','La autenticación ha fallado. Reinténtelo otra vez.');
			res.redirect("/session?redir="+redir);
		}
	}).catch(function(error){
		req.flash('error','Se ha producido un error: '+error);
		next(error);
	});
};

//DELETE /session -- Destruir sesion
exports.destroy = function(req, res, next){
	delete req.session.user;

	res.redirect("/session");//redirect a login
};