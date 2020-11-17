module.exports = (sequelize, DataTypes) => {
    const ColorTask = sequelize.define('ColorTask', {
        colorId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Color',
                key: 'id',
            },
        },
        taskId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Task',
                key: 'id',
            },
        },
    })

    ColorTask.associate = (models) => {
        ColorTask.belongsTo(models.Task, { foreignKey: 'taskId', targetKey: 'id', onDelete: 'cascade' })
        ColorTask.belongsTo(models.Color, { foreignKey: 'colorId', targetKey: 'id', onDelete: 'cascade' })
    }

    return ColorTask
}