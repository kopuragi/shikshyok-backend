const { Order } = require("../models");

exports.addOrder = async (req, res) => {
  try {
    const {
      id,
      cus_order_id,
      shop_order_id,
      user_id,
      menuName,
      price,
      totalPrice,
      visitors,
      isTakeout,
      orderTime,
      option,
      progress,
      visitTime,
    } = req.body;

    const addedOrder = await Order.create({
      id,
      cus_order_id,
      shop_order_id,
      user_id,
      menuName,
      price,
      totalPrice,
      visitors,
      isTakeout,
      orderTime,
      option,
      progress,
      visitTime,
    });

    res.status(200).json({ message: "주문이 완료되었습니다.", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};
