const db = require('../models');
const bcrypt = require('bcrypt');
const Customer = db.Customer;
const Owner = db.Owner;

// 회원가입
exports.signUp = async (req, res) => {
  const {
    nickname,
    password,
    name,
    gender,
    email,
    phoneNumber,
    companyName,
    businessRegistrationNumber,
    businessType,
    storeAddress,
    representativeName,
    membershipType,
  } = req.body;

  // 입력 유효성 검사
  if (!nickname || !password || !email || !phoneNumber) {
    return res
      .status(400)
      .json({ success: false, message: '필수 정보를 입력하세요.' });
  }

  try {
    let newUser;

    if (membershipType === 'individual') {
      const existingUser = await Customer.findOne({ where: { nickname } });
      if (existingUser)
        return res
          .status(400)
          .json({ success: false, message: '이미 사용 중인 닉네임입니다.' });

      const existingEmail = await Customer.findOne({ where: { email } });
      if (existingEmail)
        return res
          .status(400)
          .json({ success: false, message: '이미 사용 중인 이메일입니다.' });

      const hashedPassword = await bcrypt.hash(password, 10);
      newUser = await Customer.create({
        name,
        nickname,
        gender,
        user_id: nickname,
        pw: hashedPassword,
        email,
        phone: phoneNumber,
        join_date: new Date().toISOString(),
        isDelete: 'N',
        membershipType,
      });
    } else if (membershipType === 'business') {
      const existingOwner = await Owner.findOne({
        where: { user_id: nickname },
      });
      if (existingOwner)
        return res
          .status(400)
          .json({ success: false, message: '이미 사용 중인 닉네임입니다.' });

      const existingOwnerEmail = await Owner.findOne({ where: { email } });
      if (existingOwnerEmail)
        return res
          .status(400)
          .json({ success: false, message: '이미 사용 중인 이메일입니다.' });

      const hashedPassword = await bcrypt.hash(password, 10);
      newUser = await Owner.create({
        name,
        nickname,
        user_id: nickname,
        pw: hashedPassword,
        email,
        phone: phoneNumber,
        businessNumber: businessRegistrationNumber,
        ownerShopname: companyName,
        ownerShopaddress: storeAddress,
        ownerShoptype: businessType,
        representativeName,
        join_date: new Date().toISOString(),
        isDelete: 'N',
        membershipType,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: '유효하지 않은 회원 유형입니다.' });
    }

    res.status(201).json({
      success: true,
      message: '회원가입이 완료되었습니다.',
      userId: newUser.id,
    });
  } catch (error) {
    console.error('회원가입 오류:', error);
    res
      .status(500)
      .json({ success: false, message: '회원가입 중 오류가 발생했습니다.' });
  }
};

// 로그인
exports.login = async (req, res) => {
  const { user_id, password } = req.body;

  try {
    let user =
      (await Customer.findOne({ where: { user_id } })) ||
      (await Owner.findOne({ where: { user_id } }));
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: '사용자를 찾을 수 없습니다.' });

    const isMatch = await bcrypt.compare(password, user.pw);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: '비밀번호가 틀립니다.' });

    req.session.user = {
      id: user.id,
      user_id: user.user_id,
      membershipType: user.membershipType,
    };

    res.status(200).json({
      success: true,
      message: '로그인 성공',
      membershipType: user.membershipType,
      id: user.id,
      nickname: user.nickname,
      user_id: user.user_id,
    });
  } catch (error) {
    console.error('로그인 오류:', error);
    res
      .status(500)
      .json({ success: false, message: '로그인 중 오류가 발생했습니다.' });
  }
};

// 사용자 프로필 수정
exports.updateUserProfile = async (req, res) => {
  const {
    nickname,
    email,
    currentPassword,
    newPassword,
    name,
    gender,
    phoneNumber,
    address,
    companyName,
    businessType,
    storeAddress,
    representativeName,
    businessRegistrationNumber,
  } = req.body;

  const userId = req.session.user.id;
  const membershipType = req.session.user.membershipType;

  try {
    let user;
    if (membershipType === 'individual') {
      user = await Customer.findOne({ where: { id: userId } });
    } else if (membershipType === 'business') {
      user = await Owner.findOne({ where: { id: userId } });
    } else {
      return res
        .status(400)
        .json({ success: false, message: '유효하지 않은 회원 유형입니다.' });
    }

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: '사용자를 찾을 수 없습니다.' });
    }

    if (nickname) user.nickname = nickname;
    if (email) user.email = email;

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.pw);
      if (!isMatch) {
        return res
          .status(401)
          .json({ success: false, message: '기존 비밀번호가 틀립니다.' });
      }
      user.pw = await bcrypt.hash(newPassword, 10);
    }

    if (name) user.name = name;
    if (gender) user.gender = gender;
    if (phoneNumber) user.phone = phoneNumber;
    if (address) user.address = address;

    if (membershipType === 'business') {
      if (companyName) user.ownerShopname = companyName;
      if (businessType) user.ownerShoptype = businessType;
      if (storeAddress) user.ownerShopaddress = storeAddress;
      if (representativeName) user.representativeName = representativeName;
      if (businessRegistrationNumber)
        user.businessNumber = businessRegistrationNumber;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: '프로필이 업데이트되었습니다.',
      user: {
        id: user.id,
        nickname: user.nickname,
        email: user.email,
        name: user.name,
        gender: user.gender,
        phone: user.phone,
        address: user.address,
        membershipType: user.membershipType,
      },
    });
  } catch (error) {
    console.error('프로필 업데이트 오류:', error);
    return res.status(500).json({
      success: false,
      message: '프로필 업데이트 중 오류가 발생했습니다.',
    });
  }
};

// 사용자 탈퇴 핸들러
exports.deleteUser = async (req, res) => {
  const { username, membershipType } = req.params;

  try {
    let user;

    if (membershipType === 'individual') {
      user = await Customer.findOne({ where: { nickname: username } });
      if (user) {
        await Customer.destroy({ where: { nickname: username } });
        console.log(`삭제됨: 일반회원 (${username})`);
        return res
          .status(200)
          .json({ success: true, message: '사용자가 탈퇴되었습니다.' });
      }
    } else if (membershipType === 'business') {
      user = await Owner.findOne({ where: { user_id: username } });
      if (user) {
        await Owner.destroy({ where: { user_id: username } });
        console.log(`삭제됨: 점주회원 (${username})`);
        return res
          .status(200)
          .json({ success: true, message: '사용자가 탈퇴되었습니다.' });
      }
    } else {
      return res
        .status(400)
        .json({ success: false, message: '유효하지 않은 회원 유형입니다.' });
    }

    return res
      .status(404)
      .json({ success: false, message: '사용자를 찾을 수 없습니다.' });
  } catch (error) {
    console.error('사용자 탈퇴 오류:', error);
    return res
      .status(500)
      .json({ success: false, message: '사용자 탈퇴 중 오류가 발생했습니다.' });
  }
};

// 로그아웃
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('로그아웃 중 오류 발생:', err);
      return res
        .status(500)
        .json({ success: false, message: '로그아웃 중 오류가 발생했습니다.' });
    }
    res.status(200).json({ success: true, message: '로그아웃 성공' });
  });
};

// 로그인한 사용자 정보 가져오기
exports.getUserProfile = async (req, res) => {
  if (!req.session.user) {
    return res
      .status(401)
      .json({ success: false, message: '로그인이 필요합니다.' });
  }

  const userId = req.session.user.id;
  const membershipType = req.session.user.membershipType;

  try {
    let user;

    if (membershipType === 'individual') {
      user = await Customer.findOne({ where: { id: userId } });
    } else if (membershipType === 'business') {
      user = await Owner.findOne({ where: { id: userId } });
    }

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: '사용자를 찾을 수 없습니다.' });
    }

    return res.status(200).json({
      success: true,
      message: '사용자 프로필 조회 성공',
      user: {
        id: user.id,
        name: user.name,
        nickname: user.nickname,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        address: user.address,
        join_date: user.join_date,
        membershipType: user.membershipType,
        ...(membershipType === 'business' && {
          businessNumber: user.businessNumber,
          ownerShopname: user.ownerShopname,
          ownerShopaddress: user.ownerShopaddress,
          ownerShoptype: user.ownerShoptype,
          representativeName: user.representativeName,
        }),
      },
    });
  } catch (error) {
    console.error('사용자 프로필 조회 오류:', error);
    return res.status(500).json({
      success: false,
      message: '사용자 프로필 조회 중 오류가 발생했습니다.',
    });
  }
};

// 현재 비밀번호 확인
exports.checkPassword = async (req, res) => {
  const { currentPassword } = req.body;

  if (!req.session.user) {
    return res
      .status(401)
      .json({ success: false, message: '로그인이 필요합니다.' });
  }

  const userId = req.session.user.id;
  const membershipType = req.session.user.membershipType;

  try {
    let user;

    if (membershipType === 'individual') {
      user = await Customer.findOne({ where: { id: userId } });
    } else if (membershipType === 'business') {
      user = await Owner.findOne({ where: { id: userId } });
    }

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: '사용자를 찾을 수 없습니다.' });
    }

    // 비밀번호 확인
    const isMatch = await bcrypt.compare(currentPassword, user.pw);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: '비밀번호가 틀립니다.' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('비밀번호 확인 오류:', error);
    return res.status(500).json({
      success: false,
      message: '비밀번호 확인 중 오류가 발생했습니다.',
    });
  }
};
