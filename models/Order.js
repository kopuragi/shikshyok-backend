const Order = (sequelize, DataTypes) => {
  return sequelize.define(
    "order",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      shop_order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "shop",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      menuName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      price: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      totalPrice: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      visitors: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      isTakeout: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      orderTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      option: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      progress: {
        type: DataTypes.ENUM("수락", "진행 중", "완료", "거절"),
        allowNull: false,
      },
      visitTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
    },
    { timestamps: false, freezeTableName: true }
  );
};
module.exports = Order;
