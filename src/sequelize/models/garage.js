module.exports = (sequelize, DataType) => {
  const garageTable = sequelize.define('garage', {
    id: {
      type: DataType.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fkUserId: {
      type: DataType.INTEGER,
      allowNull: false,
    },
    fkCarId: {
      type: DataType.INTEGER,
      allowNull: false,
    }
  }, {
    freezeTableName: true,
  });

  garageTable.associate = (models) => {
    garageTable.belongsTo(models.cars, 
      { foreignKey: { name: 'fkCarId', allowNull: false }, foreignKeyConstraint: true}
    );
  }

  return garageTable;
};