const OrderMenu = (sequelize, DataTypes) => {
  return sequelize.define(
    "orderedMenu",
    {
      menuName: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      price: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      totalPrice: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      visitTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );
};

module.exports = OrderMenu;
