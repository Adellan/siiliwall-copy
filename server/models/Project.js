module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define('Project', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        orderNumber: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })
    Project.associate = (models) => {
        Project.hasMany(models.Board, {
            foreignKey: 'boardId'
        })
        Project.hasMany(models.User, {
            foreignKey: 'userId',
        })
    }
    return Project
}