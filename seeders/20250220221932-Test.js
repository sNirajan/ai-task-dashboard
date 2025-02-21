'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert('Users', [
      {
        name: 'Test',
        email: 'Test@example.com',
        password: await bcrypt.hash('securepassword', 10), // Hash the password
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete('Users', { email: 'newuser@example.com' }, {});
  }
};
