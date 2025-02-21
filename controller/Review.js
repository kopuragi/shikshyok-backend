const db = require("../models");
const { Shop, Review, Reviewfile, Customer } = db;
exports.getOwnerReview = async (req, res) => {
  try {
    // 세션에서 userId 가져오기
    // if (!req.session.userId) {
    //   return res.status(401).json({ message: "로그인 필요" });
    // }

    console.log("shopId", req.query.shopId); // test 용

    // 가게 아이디로 리뷰 조회
    // - 리뷰, 리뷰파일, 회원 조회
    const review = await Review.findAll({
      where: { shop_id: req.query.shopId },
      include: [
        {
          model: Reviewfile,
          as: "reviewfile",
        },
        {
          model: Customer,
          as: "customer",
          attributes: ["nickname"], // 닉네임만 가져오기
        },
      ],
    });

    const reviews = review.map((review) => ({
      id: review.id,
      cus_rev_id: review.cus_rev_id,
      shop_id: review.shop_id,
      score: review.score,
      content: review.content,
      writeTime: review.writeTime,
      owner_review: review.owner_review,
      reviewfile: review.reviewfile ? review.reviewfile.saveRfile : null,
      customer_nickname: review.customer.nickname,
    }));

    console.log(reviews);

    res.status(200).json({ reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

//patch /api-sever/owner-review/:id
exports.updateOwnerReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { owner_review } = req.body;

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ message: "리뷰를 찾을 수 없습니다." });
    }

    review.owner_review = owner_review;
    await review.save();

    res.status(200).json({ message: "리뷰가 수정되었습니다.", review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};
