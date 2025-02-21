'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface) => {
    // Check if users already exist
    const existingUsers = await queryInterface.sequelize.query(
      `SELECT email FROM "Users" WHERE email IN ('admin@example.com', 'user@example.com')`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const existingEmails = existingUsers.map(user => user.email);

    const usersToInsert = [];

    if (!existingEmails.includes('admin@example.com')) {
      usersToInsert.push({
        name: 'Admin User',
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    if (!existingEmails.includes('snirajan@gmail.com')) {
      usersToInsert.push({
        name: 'Nirajan Shah',
        email: 'snirajan@gmail.com',
        password: await bcrypt.hash('nirajan123', 10),
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    if (!existingEmails.includes('user@example.com')) {
      usersToInsert.push({
        name: 'Regular User',
        email: 'user@example.com',
        password: await bcrypt.hash('user123', 10),
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    if (usersToInsert.length > 0) {
      await queryInterface.bulkInsert('Users', usersToInsert);
    }
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete('Users', {
      email: ['admin@example.com', 'user@example.com']
    });
  }
};
