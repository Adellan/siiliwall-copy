module.exports = (sequelize, DataTypes) => {
    const Board = sequelize.define('Board', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
        },
        prettyId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ticketCount: DataTypes.INTEGER,
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        orderNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        color: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })
    Board.associate = (models) => {
        Board.hasMany(models.Column, {
            foreignKey: 'boardId',
        })
        // Board has one creator user
        Board.belongsTo(models.User, {
            foreignKey: 'creatorId',
        })
        Board.hasMany(models.Story, {
            foreignKey: 'boardId',
        })
        Board.hasMany(models.Task, {
            foreignKey: 'boardId',
        })
        Board.belongsTo(models.Project, {
            foreignKey: 'projectId'
        })
    }
    return Board
}
