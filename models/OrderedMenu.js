const OrderedMenu = (sequelize, DataTypes) => {
  return sequelize.define(
    "orderedMenu",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      orderMenu: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      orderMenuPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { timestamps: false, freezeTableName: true }
  );
};

module.exports = OrderedMenu;
