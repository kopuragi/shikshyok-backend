const db = require("../models");
const { OrderedMenu, Order, Sequelize, OrderedVisitor } = db;
exports.orderMenu = async (req, res) => {
  const { startDate, endDate } = req.body;
  try {
    const result = await OrderedMenu.findAll({
      where: {
        visitTime: {
          [Sequelize.Op.gte]: new Date(startDate),
          [Sequelize.Op.lt]: new Date(endDate),
        },
      },
      attributes: [
        "visitTime",
        "menuName",
        [
          Sequelize.fn("SUM", Sequelize.col("orderedMenu.totalPrice")),
          "totalPrice",
        ],
      ],
      include: [
        {
          model: Order,
          attributes: [],
        },
      ],
      group: ["visitTime", "menuName"],
      order: [["visitTime", "ASC"]],
    });

    const menu = result.map((el) => el.toJSON());

    const menuSum = menu.reduce((sum, menu) => sum + menu.totalPrice, 0);
    res.send({ menu, menuSum });
  } catch (error) {
    console.error("Error :", error);
    res.status(500).send("Server error");
  }
};

exports.orderVisitor = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const result = await OrderedVisitor.findAll({
      where: {
        visitTime: {
          [Sequelize.Op.gte]: new Date(startDate),
          [Sequelize.Op.lt]: new Date(endDate),
        },
      },
      attributes: ["visitors", "isTakeOut", "visitTime"],
      include: [{ model: Order, attributes: [] }],
    });
    console.log(result);
    const takeOutResult = result.map((el) => el.toJSON());
    const takeOutData = takeOutResult.reduce(
      (acc, visitor) => {
        if (visitor.isTakeOut) {
          acc.takeOut += visitor.visitors;
        } else {
          acc.takeIn += visitor.visitors;
        }
        acc.visitors = acc.takeIn + acc.takeOut;
        return acc;
      },
      { takeOut: 0, takeIn: 0, visitor: 0 }
    );
    const takeOutDate = takeOutResult.reduce((acc, visit) => {
      acc[visit.visitTime] = {
        name: visit.visitTime,
        visitors: visit.visitors,
        isTakeOut: visit.isTakeOut,
      };
      return acc;
    }, {});
    res.send({ takeOutData, takeOutDate });
  } catch (error) {
    console.error("Error fetching income:", error);
    res.status(500).send("Server error while fetching income.");
  }
};

exports.reVisitor = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const result = await OrderedVisitor.findAll({
      where: {
        visitTime: {
          [Sequelize.Op.gte]: new Date(startDate),
          [Sequelize.Op.lt]: new Date(endDate),
        },
      },
      attributes: ["user_id", "visitors", "visitTime"],
      include: [{ model: Order, attributes: [] }],
    });
    const reVisit = result.map((el) => el.toJSON());

    const reVisitData = reVisit.reduce((acc, visitor) => {
      if (!acc[visitor.user_id]) {
        acc[visitor.user_id] = {
          userId: visitor.user_id,
          number: 0,
          isReVisit: false,
        };
      } else {
        acc[visitor.user_id].isReVisit = true;
      }
      acc[visitor.user_id].number += Number(visitor.visitors);
      return acc;
    }, {});
    res.send({ reVisitData, reVisit });
  } catch (error) {
    console.error("Error fetching income:", error);
    res.status(500).send("Server error while fetching income.");
  }
};
