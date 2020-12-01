module.exports = (sequelize, DataType) => {
  const carsTable = sequelize.define('cars', {
    id: {
      type: DataType.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    brand: {
      type: DataType.STRING,
      allowNull: false,
    },
    model: {
      type: DataType.STRING,
      allowNull: false,
    },
    year: {
      type: DataType.INTEGER,
      allowNull: false,
    },
    engine_type: {
      type: DataType.ENUM('Petrol', 'Diesel', 'Gas', 'Electric'),
      allowNull: false,
    },
    engine_capacity: {
      type: DataType.FLOAT(5,1),
      allowNull: false,
    }
  }, {
    freezeTableName: true,
  });

  return carsTable;
};