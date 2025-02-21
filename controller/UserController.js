const db = require('../models');
const bcrypt = require('bcrypt');
const Customer = db.Customer;
const Owner = db.Owner;

// 회원가입
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

    // 회원 유형에 따라 콘솔에 출력
    console.log(`회원가입 요청: ${membershipType} 회원`);

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
        where: { userid: username },
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

// 로그인
exports.login = async (req, res) => {
  const { userid, password } = req.body;

  try {
    let user;

    // 일반회원 로그인
    user = await Customer.findOne({ where: { userid } });
    if (!user) {
      // 점주회원 로그인
      user = await Owner.findOne({ where: { userid } });
      if (!user) {
        return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      }
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

// 사용자 프로필 업데이트 (통합)
exports.updateUserProfile = async (req, res) => {
  const {
    nickname,
    email,
    password,
    name,
    gender,
    birthdate,
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
    let user;

    // 회원 유형에 따라 사용자 조회
    if (membershipType === 'individual') {
      user = await Customer.findOne({ where: { nickname } });
    } else if (membershipType === 'business') {
      user = await Owner.findOne({ where: { nickname } });
    } else {
      return res
        .status(400)
        .json({ message: '유효하지 않은 회원 유형입니다.' });
    }

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 이메일 업데이트
    if (email) {
      user.email = email;
    }

    // 비밀번호 업데이트
    if (password) {
      user.pw = await bcrypt.hash(password, 10);
    }

    // 일반회원 및 점주회원의 공통 정보 업데이트
    if (name) {
      user.name = name;
    }
    if (gender) {
      user.gender = gender;
    }
    if (birthdate) {
      user.birthdate = birthdate;
    }
    if (phoneNumber) {
      user.phone = phoneNumber;
    }
    if (address) {
      user.address = address;
    }

    // 기업회원일 경우 추가 정보 업데이트
    if (membershipType === 'business') {
      if (companyName) {
        user.companyName = companyName;
      }
      if (businessType) {
        user.businessType = businessType;
      }
      if (storeAddress) {
        user.storeAddress = storeAddress;
      }
      if (representativeName) {
        user.representativeName = representativeName;
      }
      if (businessRegistrationNumber) {
        user.businessRegistrationNumber = businessRegistrationNumber;
      }
    }

    await user.save(); // 변경 사항 저장

    return res.status(200).json({ message: '프로필이 업데이트되었습니다.' });
  } catch (error) {
    console.error('프로필 업데이트 오류:', error);
    return res
      .status(500)
      .json({ message: '프로필 업데이트 중 오류가 발생했습니다.' });
  }
};

// 사용자 탈퇴 핸들러
exports.deleteUser = async (req, res) => {
  const { username } = req.params;

  try {
    // Customer 테이블에서 사용자 조회
    const customer = await Customer.findOne({ where: { nickname: username } });
    if (customer) {
      await Customer.destroy({ where: { nickname: username } });
      console.log(`삭제됨: 일반회원 (${username})`);
      return res.status(200).json({ message: '사용자가 탈퇴되었습니다.' });
    }

    // Owner 테이블에서 사용자 조회
    const owner = await Owner.findOne({ where: { userid: username } });
    if (owner) {
      await Owner.destroy({ where: { userid: username } });
      console.log(`삭제됨: 점주회원 (${username})`);
      return res.status(200).json({ message: '사용자가 탈퇴되었습니다.' });
    }

    // 사용자가 존재하지 않을 경우
    return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
  } catch (error) {
    console.error('사용자 탈퇴 오류:', error);
    return res
      .status(500)
      .json({ message: '사용자 탈퇴 중 오류가 발생했습니다.' });
  }
};
