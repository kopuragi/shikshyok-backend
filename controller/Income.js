const db = require("../models");
const { OrderedMenu, Order, Sequelize, OrderedVisitor } = db;
const { Op, fn, col } = require("sequelize");
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
        "price",
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
      group: ["visitTime", "menuName", "price"],
      order: [["visitTime", "ASC"]],
    });

    const menu = result.map((el) => el.toJSON());
    const priceSum = menu.reduce((sum, menu) => sum + menu.totalPrice, 0);
    const datePerSum = menu.reduce((sum, menu) => {
      if (sum[menu.visitTime]) {
        sum[menu.visitTime].매출 += menu.totalPrice;
      } else {
        sum[menu.visitTime] = { 날짜: menu.visitTime, 매출: menu.totalPrice };
      }
      return sum;
    }, {});

    const getRandomColor = () => {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };

    const groupedMenu = {};
    menu.forEach((item) => {
      const name = item.menuName;
      const price = Number(item.price);
      const totalPrice = Number(item.totalPrice);
      const value = totalPrice / price;

      if (!groupedMenu[name]) {
        groupedMenu[name] = {
          name,
          value: 0,
          color: getRandomColor(),
        };
      }

      groupedMenu[name].value += value;
    });

    res.send({ menu, priceSum, datePerSum, groupedMenu });
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
          [Op.gte]: new Date(startDate),
          [Op.lte]: new Date(endDate),
        },
      },
      attributes: [
        "visitTime",
        "isTakeOut",
        [fn("SUM", col("visitors")), "totalVisitors"],
      ],
      group: ["visitTime", "isTakeOut"],
      order: [["visitTime", "ASC"]],
    });
    const takeOut = result.map((el) => el.toJSON());
    const takeOutData = takeOut.reduce(
      (sum, takeout) => {
        const type = takeout.isTakeOut === 1 ? "takeOut" : "takeIn";

        const visitors = Number(takeout.totalVisitors) || 0;
        sum[type] += visitors;

        return sum;
      },
      { takeOut: 0, takeIn: 0 }
    );

    const totalVisitors = takeOut.reduce((sum, takeout) => {
      const date = takeout.visitTime;
      const isTakeOut = takeout.isTakeOut === 1 ? "포장" : "매장";

      if (!sum[date]) {
        sum[date] = { 날짜: date, 포장: 0, 매장: 0, 방문자수: 0 };
      }

      sum[date][isTakeOut] += Number(takeout.totalVisitors);
      sum[date].방문자수 += Number(takeout.totalVisitors);

      return sum;
    }, {});

    res.send({ takeOutData, totalVisitors });
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
