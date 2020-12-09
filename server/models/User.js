module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        passwordHash: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        },
    })
    User.associate = (models) => {
        User.hasMany(models.Story, {
            foreignKey: 'ownerId',
        })
        User.belongsTo(models.Project, {
            foreignKey: 'projectId'
        })
        // User may have created multiple tasks
        User.hasMany(models.Task, {
            foreignKey: 'ownerId',
        })
        User.belongsToMany(models.Story, {
            through: models.UserStory,
            foreignKey: 'userId',
        })
        // User may be working on multiple tasks
        User.belongsToMany(models.Task, {
            through: models.UserTask,
            foreignKey: 'userId',
        })
        // user may be working on multiple subtasks
        User.belongsToMany(models.Subtask, {
            through: models.UserSubtask,
            foreignKey: 'userId',
        })
    }

    return User
}
