const db = require('../models'); // 모델 가져오기

const Customer = db.Customer; // 고객 모델
const Owner = db.Owner; // 점주 모델
const Wallet = db.Wallet; // 고객 지갑 모델
const OwnerWallet = db.OwnerWallet; // 점주 지갑 모델

class MoneyController {
  // 머니 충전 메서드
  static async chargeMoney(req, res) {
    const { amount, userId } = req.body; // 요청 본문에서 금액과 사용자 ID 가져오기

    // 금액 유효성 검사
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: '유효한 금액을 입력하세요.' });
    }

    try {
      // userId로 사용자 정보 확인
      const user =
        (await Customer.findOne({ where: { id: userId } })) ||
        (await Owner.findOne({ where: { id: userId } }));

      if (!user) {
        return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      }

      let wallet;

      // 사용자 유형에 따라 처리
      if (user.membershipType === 'individual') {
        wallet = await Wallet.findOne({ where: { customer_id: user.id } });
      } else if (user.membershipType === 'business') {
        wallet = await OwnerWallet.findOne({ where: { owner_id: user.id } });
      }

      if (!wallet) {
        return res
          .status(404)
          .json({ message: '사용자의 지갑을 찾을 수 없습니다.' });
      }

      // 금액 충전
      wallet.chargedMoney += amount;
      wallet.totalMoney += amount;
      wallet.chargeTime = new Date();
      await wallet.save();

      return res.status(200).json({
        message: '머니 충전이 완료되었습니다.',
        balance: wallet.totalMoney, // 총 잔액 반환
      });
    } catch (error) {
      console.error('머니 충전 오류:', error.message);
      return res
        .status(500)
        .json({ message: '머니 충전 중 오류가 발생했습니다.' });
    }
  }

  // 사용자 정보 확인 메서드
  static async getUserInfo(req, res) {
    const user = req.session.user; // 세션에서 사용자 정보 가져오기

    if (!user) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    try {
      let userInfo;

      if (user.membershipType === 'individual') {
        userInfo = await Customer.findOne({ where: { id: user.id } });
      } else if (user.membershipType === 'business') {
        userInfo = await Owner.findOne({ where: { id: user.id } });
      }

      if (!userInfo) {
        console.error(`사용자를 찾을 수 없습니다. userId: ${user.id}`);
        return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      }

      return res.status(200).json(userInfo);
    } catch (error) {
      console.error('사용자 정보 조회 오류:', error.message);
      return res
        .status(500)
        .json({ message: '사용자 정보를 조회하는 중 오류가 발생했습니다.' });
    }
  }
}

module.exports = MoneyController;
