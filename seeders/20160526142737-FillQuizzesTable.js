'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Quizzes',[
      { question: 'Capital de Italia', answer: 'Roma',
        createdAt: new Date(), updateAt: new Date() },
      { question: 'Capital de Portugal', answer: 'Lisboa',
        createdAt: new Date(), updateAt: new Date() },
      { question: 'Capital de España', answer: 'Madrid',
        createdAt: new Date(), updateAt: new Date() },
    ]);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Quizzes', null, {});
  }
};
