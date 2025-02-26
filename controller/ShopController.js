const db = require("../models");
const Shop = db.Shop;

exports.getShop = async (req, res) => {
  try {
    const shop = await Shop.findAll();
    console.log("샵 조회 확인 = ", shop);
    res.status(200).send({ shop });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "서버 오류가 발생했습니다." });
  }
};
