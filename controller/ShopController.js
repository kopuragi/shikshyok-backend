const db = require("../models");
const Shop = db.Shop;
const Owner = db.Owner;

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

exports.getOwner = async (req, res) => {
  const { shopLoginId } = req.params;

  console.log("겟오너 아이디 값 = ", shopLoginId);
  try {
    const owner = await Owner.findOne({
      where: {
        id: shopLoginId,
      },
    });
    console.log("오너 조회 확인 = ", owner);
    res.status(200).send({ owner });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "서버 오류가 발생했습니다." });
  }
};
