var path = require('path');

//Cargar Modelo QRM
var Sequelize = require('sequelize');

//Postgres DATABASE_URL = postgres://user:psswd@host:port/database
//SQLite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);

var DATABASE_PROTOCOL 	= url[1];
var DATABASE_DIALECT 	= url[1];
var DATABASE_USER 		= url[2];
var DATABASE_PASSWORD 	= url[3];
var DATABASE_HOST 		= url[4];
var DATABASE_PORT 		= url[5];
var DATABASE_NAME 		= url[6];
var DATABASE_STORAGE	= process.env.DATABASE_STORAGE;


//Usar BBDD SQLite o Postgres:
var sequelize = new Sequelize(	DATABASE_NAME, 
								DATABASE_USER, 
								DATABASE_PASSWORD, 
								{dialect: DATABASE_DIALECT,
								protocol: DATABASE_PROTOCOL,
								port: DATABASE_PORT,	
								host: DATABASE_HOST, 
								storage: DATABASE_STORAGE,//solo sqlite
								omitNull: true //solo pg
							});

//Importar la definicion de la tabla Quiz de quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

//Importar la definicion de la tabla Comments de comment.js
var Comment = sequelize.import(path.join(__dirname,'comment'));

//Importar la definicion de la tabla Users de user.js
var User = sequelize.import(path.join(__dirname,'user'));

//Relaciones 1 a N entre Quiz y Comment
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

//Relacion 1 a N entre User y Quiz
User.hasMany(Quiz, {foreignKey: 'AuthorId'});
Quiz.belongsTo(User, {as: 'Author', foreignKey: 'AuthorId'});
//sequelize.sync() crea e inicializa tabla de preguntas en DB
/*sequelize.sync().then(function(){//sync() crea la tabla quiz
	return Quiz.count().then(function(c){
		if(c === 0){//la tabla se inicializa si está vacia
			return Quiz.bulkCreate([ 
				{question: 'Capital de Italia',
				answer: 'Roma'},
				{question: 'Capital de Portugal',
				answer: 'Lisboa'}
			]).then(function(){
				console.log('Base de datos inicializada con datos');
			});
		}
	});

}).catch(function(error){
	console.log("Error Sincronizando las tablas de la BBDD:",error);
	process.exit(1);
});*/
exports.Quiz = Quiz;//exportar definicion de tabla Quiz
exports.Comment = Comment;//exportar definicion de tabla Comments
exports.User = User;//exportar definiciion de tabla Users