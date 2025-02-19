const { Shop } = require("../models");

exports.getIndex = (req, res) => {
  res.send("response from api-server: [GET /api-server]");
};

exports.getOwner = async (req, res) => {
  try {
    // 세션에서 userId 가져오기
    // if (!req.session.userId) {
    //   return res.status(401).json({ message: "로그인 필요" });
    // }

    console.log(req.query.userId); // test 용
    const token = req.query.userId; // test용 params=1 받는것

    // 사용자 아이디로 가게 목록 조회
    // const shops = await Shop.findAll({
    // where: { ownerId: req.session.userId } });

    const shops = await Shop.findAll({
      where: { owner_id: token },
      attributes: ["id", "shopName"], //가게아이디와 가게이름만 조회
    });
    // console.log(shops);

    res.status(200).json({ shops });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};
