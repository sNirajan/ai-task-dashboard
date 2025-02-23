"use strict";

module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define(
    "Task",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("To-Do", "In-Progress", "Completed"),
        defaultValue: "To-Do",
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // Foreign key linking tasks to users
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      timestamps: true, // Automatically manages createdAt and updatedAt fields
    }
  );

  // Define Association: Task belongs to a User
  Task.associate = (models) => {
    Task.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  };
  return Task;
};

/* What This Model Does:

- Defines Task with fields: title, description, status, and userId.
- Links each task to a User via userId (Foreign Key).
- Automatically manages timestamps (createdAt and updatedAt).
- Associates Task with User, allowing queries like: 
    Task.findAll({ include: { model: User, as: "user" } }); 
*/
