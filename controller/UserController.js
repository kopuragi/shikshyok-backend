const db = require('../models');
const bcrypt = require('bcrypt');
const Customer = db.Customer;
const Owner = db.Owner;

// // 이메일 중복 확인 (일반회원)
// exports.checkEmailExists = async (req, res) => {
//   const { email } = req.query;

//   try {
//     const customer = await Customer.findOne({ where: { email } });
//     return res.status(200).json({ exists: Boolean(customer) });
//   } catch (error) {
//     console.error('이메일 중복 확인 오류:', error);
//     return res
//       .status(500)
//       .json({ message: '이메일 중복 확인 중 오류가 발생했습니다.' });
//   }
// };

exports.signUp = async (req, res) => {
  const {
    username,
    password,
    name,
    gender,
    email,
    phoneNumber,
    address,
    companyName,
    businessType,
    storeAddress,
    representativeName,
    businessRegistrationNumber,
    membershipType,
  } = req.body;

  try {
    let newUser;

    // 일반회원 가입
    if (membershipType === 'individual') {
      const existingUser = await Customer.findOne({
        where: { userid: username },
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: '이미 사용 중인 아이디입니다.' });
      }

      const existingEmail = await Customer.findOne({ where: { email } });
      if (existingEmail) {
        return res
          .status(400)
          .json({ message: '이미 사용 중인 이메일입니다.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      newUser = await Customer.create({
        name,
        nickname: username,
        gender,
        userid: username,
        pw: hashedPassword,
        email,
        phone: phoneNumber,
        address,
        join_date: new Date().toISOString(),
        isDelete: 'N',
      });

      // 점주회원 가입
    } else if (membershipType === 'business') {
      const existingOwner = await Owner.findOne({
        where: { nickname: username },
      });
      if (existingOwner) {
        return res
          .status(400)
          .json({ message: '이미 사용 중인 아이디입니다.' });
      }

      const existingOwnerEmail = await Owner.findOne({ where: { email } });
      if (existingOwnerEmail) {
        return res
          .status(400)
          .json({ message: '이미 사용 중인 이메일입니다.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      newUser = await Owner.create({
        name,
        userid: username,
        nickname: username,
        pw: hashedPassword,
        email,
        phone: phoneNumber,
        businessNumber: businessRegistrationNumber,
        shop_name: companyName,
        shop_address: storeAddress,
        shop_type: businessType,
        representativeName,
        join_date: new Date().toISOString(),
        isDelete: 'N',
      });
    } else {
      return res
        .status(400)
        .json({ message: '유효하지 않은 회원 유형입니다.' });
    }

    res
      .status(201)
      .json({ message: '회원가입이 완료되었습니다.', userId: newUser.id });
  } catch (error) {
    console.error('회원가입 오류:', error);
    res.status(500).json({ message: '회원가입 중 오류가 발생했습니다.' });
  }
};

//로그인
exports.login = async (req, res) => {
  const { userid, password } = req.body;

  try {
    let user;

    // 일반회원 로그인
    user = await Customer.findOne({ where: { userid } });
    if (user) {
      console.log('일반회원입니다.');
    } else {
      // 점주회원 로그인
      user = await Owner.findOne({ where: { userid } });
      if (!user) {
        return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      }
      console.log('점주회원입니다.');
    }

    const isMatch = await bcrypt.compare(password, user.pw);
    if (!isMatch) {
      return res.status(401).json({ message: '비밀번호가 틀립니다.' });
    }

    req.session.user = { id: user.id, userid: user.userid };

    return res.status(200).json({ message: '로그인 성공' });
  } catch (error) {
    console.error('로그인 오류:', error);
    return res.status(500).json({ message: '로그인 중 오류가 발생했습니다.' });
  }
};

// 사업자 등록 (점주회원)
exports.registerBusiness = async (req, res) => {
  const {
    nickname,
    password,
    email,
    businessNumber,
    shop_name,
    shop_address,
    shop_type,
    ...otherData
  } = req.body;

  try {
    // 아이디 중복 확인
    const existingOwner = await Owner.findOne({ where: { nickname } });
    if (existingOwner) {
      return res.status(400).json({ message: '이미 사용 중인 아이디입니다.' });
    }

    // 이메일 중복 확인
    const existingEmail = await Owner.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: '이미 사용 중인 이메일입니다.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 사업자 생성
    const newBusinessOwner = await Owner.create({
      nickname,
      pw: hashedPassword,
      email,
      businessNumber,
      shop_name,
      shop_address,
      shop_type,
      ...otherData,
    });

    return res
      .status(201)
      .json({ message: '사업자 등록 완료', userId: newBusinessOwner.id });
  } catch (error) {
    console.error('사업자 등록 오류:', error);
    return res
      .status(500)
      .json({ message: '사업자 등록 중 오류가 발생했습니다.' });
  }
};

// 비밀번호 재설정 (일반회원)
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await Customer.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await Customer.update({ pw: hashedPassword }, { where: { email } });

    return res.status(200).json({ message: '비밀번호가 재설정되었습니다.' });
  } catch (error) {
    console.error('비밀번호 재설정 오류:', error);
    return res
      .status(500)
      .json({ message: '비밀번호 재설정 중 오류가 발생했습니다.' });
  }
};

// 점주회원 정보 조회
exports.getOwnerProfile = async (req, res) => {
  const { nickname } = req.params;

  try {
    const owner = await Owner.findOne({ where: { nickname } });
    if (!owner) {
      return res.status(404).json({ message: '점주를 찾을 수 없습니다.' });
    }

    return res.status(200).json(owner);
  } catch (error) {
    console.error('점주 정보 조회 오류:', error);
    return res
      .status(500)
      .json({ message: '점주 정보 조회 중 오류가 발생했습니다.' });
  }
};

// 사용자 탈퇴 핸들러
exports.deleteUser = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await Customer.findOne({ where: { nickname: username } });
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    await Customer.destroy({ where: { nickname: username } });
    return res.status(200).json({ message: '사용자가 탈퇴되었습니다.' });
  } catch (error) {
    console.error('사용자 탈퇴 오류:', error);
    return res
      .status(500)
      .json({ message: '사용자 탈퇴 중 오류가 발생했습니다.' });
  }
};

// 점주회원 인증 상태 확인
exports.checkOwnerAuthStatus = (req, res) => {
  if (req.session.user) {
    return res.status(200).json({ authenticated: true });
  } else {
    return res.status(401).json({ authenticated: false });
  }
};

// 점주회원 역할 관리
exports.updateOwnerRole = async (req, res) => {
  const { userId, role } = req.body;

  try {
    const owner = await Owner.findByPk(userId);
    if (!owner) {
      return res.status(404).json({ message: '점주를 찾을 수 없습니다.' });
    }

    owner.role = role;
    await owner.save();

    return res.status(200).json({ message: '점주 역할이 업데이트되었습니다.' });
  } catch (error) {
    console.error('점주 역할 업데이트 오류:', error);
    return res
      .status(500)
      .json({ message: '점주 역할 업데이트 중 오류가 발생했습니다.' });
  }
};

// 점주회원 프로필 이미지 업로드
exports.uploadOwnerProfileImage = async (req, res) => {
  const { nickname } = req.params;
  const profileImage = req.file;

  try {
    const owner = await Owner.findOne({ where: { nickname } });
    if (!owner) {
      return res.status(404).json({ message: '점주를 찾을 수 없습니다.' });
    }

    owner.profileImage = profileImage.path;
    await owner.save();

    return res.status(200).json({
      message: '점주 프로필 이미지가 업로드되었습니다.',
      profileImage: owner.profileImage,
    });
  } catch (error) {
    console.error('점주 프로필 이미지 업로드 오류:', error);
    return res
      .status(500)
      .json({ message: '점주 프로필 이미지 업로드 중 오류가 발생했습니다.' });
  }
};

// 점주회원 프로필 업데이트
exports.updateOwnerProfile = async (req, res) => {
  const { nickname } = req.params;
  const { email, password } = req.body;

  try {
    const owner = await Owner.findOne({ where: { nickname } });
    if (!owner) {
      return res.status(404).json({ message: '점주를 찾을 수 없습니다.' });
    }

    // 이메일 업데이트
    if (email) {
      owner.email = email;
    }

    // 비밀번호 업데이트
    if (password) {
      owner.pw = await bcrypt.hash(password, 10);
    }

    await owner.save();

    return res
      .status(200)
      .json({ message: '점주 프로필이 업데이트되었습니다.' });
  } catch (error) {
    console.error('점주 프로필 업데이트 오류:', error);
    return res
      .status(500)
      .json({ message: '점주 프로필 업데이트 중 오류가 발생했습니다.' });
  }
};
// 프로필 수정 핸들러
exports.updateProfile = async (req, res) => {
  const { nickname, email } = req.body;
  const { username } = req.params;

  try {
    const user = await Customer.findOne({ where: { nickname: username } });
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 정보 업데이트
    if (email) user.email = email;

    await user.save();
    return res.status(200).json({ message: '프로필이 업데이트되었습니다.' });
  } catch (error) {
    console.error('프로필 업데이트 오류:', error);
    return res
      .status(500)
      .json({ message: '프로필 업데이트 중 오류가 발생했습니다.' });
  }
};
// 사용자 프로필 조회 핸들러
exports.getUserProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await Customer.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('사용자 프로필 조회 오류:', error);
    return res
      .status(500)
      .json({ message: '사용자 프로필 조회 중 오류가 발생했습니다.' });
  }
};
