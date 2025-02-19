const db = require("../models");
const { OrderedMenu, Order, Sequelize } = db;
exports.income = async (req, res) => {
  console.log(OrderedMenu);
  console.log(Order);
  const { startDate, endDate } = req.body;
  try {
    console.log(startDate, endDate);
    const result = await OrderedMenu.findAll({
      where: {
        visitTime: {
          [Sequelize.Op.gte]: new Date(startDate),
          [Sequelize.Op.lt]: new Date(endDate),
        },
      },
      attributes: ["menuName", "price", "totalPrice"], // 필요한 컬럼만 조회
      include: [
        {
          model: Order,
          attributes: [],
        },
      ],
    });
    const menu = JSON.stringify(result);
    res.send(menu);
  } catch (error) {
    console.error("Error fetching income:", error);
    res.status(500).send("Server error while fetching income.");
  }
};
