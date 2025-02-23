const OrderedVisitor = (sequelize, DataTypes) => {
  return sequelize.define(
    "orderedVisitor",
    {
      user_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      visitors: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      isTakeout: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      visitTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );
};

module.exports = OrderedVisitor;
