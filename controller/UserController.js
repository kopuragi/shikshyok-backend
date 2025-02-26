const db = require("../models");
const bcrypt = require("bcrypt");

const Shop = db.Shop;

const Customer = db.Customer;
const Owner = db.Owner;
const Shop = db.Shop;

//owner 회원가입 시키기 가게 등록하기
exports.createOwners = async (req, res) => {
  const idNumber = await Owner.findOne({
    order: [["id", "DESC"]],
  });

  if (idNumber) {
    console.log(idNumber.id);
    id = idNumber.id;
    console.log(id);
  } else {
    id = 0;
  }

  for (let i = 0; i < 10; i++) {
    const user_id = `owner${id.toString().padStart(2, "0")}`;
    const email = `owner${id}@example.com`;
    const password = "1234"; // 여기에 실제 비밀번호를 넣어주세요
    const hashedPassword = await bcrypt.hash(password, 10);

    const newOwner = await Owner.create({
      name: `ownerName${id}`,
      nickname: `ownerNickname${id}`,
      userid: `owner${id}`,
      pw: hashedPassword,
      email,
      phone: `010-1234-567${id}`,
      businessNumber: `123-45-678${id}`,
      ownerShopname: `치킨킨${id}`,
      ownerShopaddress: `도봉구${id}`,
      ownerShoptype: "한식", // 실제로 필요한 값을 넣어주세요
      representativeName: `대표${id}`,
      join_date: new Date().toISOString(),
      isDelete: "N",
      membershipType: "business", // 실제로 필요한 값을 넣어주세요
    });

    const newShop = await Shop.create({
      // owner_id
      // shopName
      // businessNumber
      // shopAddress
      // shopPhone
      // shopType
      // shopOwner

      owner_id: newOwner.id,
      shopName: `치킨킨${id}`,
      businessNumber: `123-45-678${id}`,
      shopAddress: `도봉구${id}`,
      shopPhone: `010-1234-567${id}`,
      shopType: "한식",
      shopOwner: `ownerName${id}`,
    });

    id++;
    console.log(`오너 생성 완료: ${user_id}`);
  }
  res.send("오너 생성 완료");
};

//customer 회원가입 시키기
exports.createCustomers = async (req, res) => {
  const idNumber = await Customer.findOne({
    order: [["id", "DESC"]],
  });

  if (idNumber) {
    console.log(idNumber.id);
    id = idNumber.id;
    console.log(id);
  } else {
    id = 0;
  }

  for (let i = 0; i < 10; i++) {
    const user_id = `customer${id.toString().padStart(2, "0")}`;
    const email = `customer${id}@example.com`;
    const password = "1234"; // 여기에 실제 비밀번호를 넣어주세요
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Customer.create({
      name: `고객${id}`,
      nickname: `고객닉${id}`,
      gender: "남", // 실제로 필요한 값을 넣어주세요
      user_id: `customer${id}`,
      pw: hashedPassword,
      email,
      phone: `010-1234-567${id}`,
      join_date: new Date().toISOString(),
      isDelete: "N",
      membershipType: "individual", // 실제로 필요한 값을 넣어주세요
    });
    id++;
    console.log(`회원 생성 완료: ${user_id}`);
  }
  res.send("회원 생성 완료");
};

// 회원가입
exports.signUp = async (req, res) => {
  const {
    nickname,
    user_id,
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

  if (!nickname || !user_id || !password || !email || !phoneNumber) {
    return res
      .status(400)
      .json({ success: false, message: "필수 정보를 입력하세요." });
  }

  try {
    let newUser;

    if (membershipType === "individual") {
      const existingUser = await Customer.findOne({ where: { nickname } });
      if (existingUser)
        return res
          .status(400)
          .json({ success: false, message: "이미 사용 중인 닉네임입니다." });

      const existingEmail = await Customer.findOne({ where: { email } });
      if (existingEmail)
        return res
          .status(400)
          .json({ success: false, message: "이미 사용 중인 이메일입니다." });

      const hashedPassword = await bcrypt.hash(password, 10);
      newUser = await Customer.create({
        name,
        nickname,
        gender,
        user_id,
        pw: hashedPassword,
        email,
        phone: phoneNumber,
        join_date: new Date().toISOString(),
        isDelete: "N",
        membershipType,
      });
    } else if (membershipType === "business") {
      const existingOwner = await Owner.findOne({ where: { userid: user_id } });
      if (existingOwner)
        return res
          .status(400)
          .json({ success: false, message: "이미 사용 중인 닉네임입니다." });

      const existingOwnerEmail = await Owner.findOne({ where: { email } });
      if (existingOwnerEmail)
        return res
          .status(400)
          .json({ success: false, message: "이미 사용 중인 이메일입니다." });

      const hashedPassword = await bcrypt.hash(password, 10);
      newUser = await Owner.create({
        name,
        nickname,
        userid: user_id,
        pw: hashedPassword,
        email,
        phone: phoneNumber,
        businessNumber: businessRegistrationNumber,
        ownerShopname: companyName,
        ownerShopaddress: storeAddress,
        ownerShoptype: businessType,
        representativeName,
        join_date: new Date().toISOString(),
        isDelete: "N",
        membershipType,
      });
      //가게 정보 등록
      addshop = await Shop.create({
        owner_id: newUser.id, //임시값
        shopName: companyName,
        businessNumber: businessRegistrationNumber,
        shopAddress: storeAddress,
        shopPhone: phoneNumber,
        shopType: businessType,
        shopOwner: representativeName,
      });

      if (addshop) console.log("회원가입 겸 가게 추가 성공");
    } else {
      return res
        .status(400)
        .json({ success: false, message: "유효하지 않은 회원 유형입니다." });
    }

    res.status(201).json({
      success: true,
      message: "회원가입이 완료되었습니다.",
      userId: newUser.id,
    });
  } catch (error) {
    console.error("회원가입 오류:", error);
    res
      .status(500)
      .json({ success: false, message: "회원가입 중 오류가 발생했습니다." });
  }
};

// 로그인
exports.login = async (req, res) => {
  const { user_id, password, membershipType } = req.body;

  console.log(`로그인 요청: ${user_id}`);
  console.log(`로그인 요청: ${membershipType} 회원`);

  if (membershipType === "individual") {
    try {
      const user = await Customer.findOne({ where: { user_id: user_id } });

      if (!user) {
        return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      } else {
        const isMatch = await bcrypt.compare(password, user.pw);
        if (!isMatch) {
          return res.status(401).json({ message: "비밀번호가 틀립니다." });
        }

        req.session.user = {
          id: user.id,
          userid: user.user_id,
          membershipType: user.membershipType,
        };

        return res.status(200).json({
          message: "로그인 성공",
          membershipType: user.membershipType,
          isSuccess: true,
          id: user.id,
          nickname: user.nickname,
          user_id: user.user_id,
          type: user.membershipType,
          phone: user.phone,
        });
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      return res
        .status(500)
        .json({ message: "로그인 중 오류가 발생했습니다." });
    }
  }

  if (membershipType === "business") {
    try {
      const user = await Owner.findOne({ where: { userid: user_id } });

      if (!user) {
        return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      } else {
        const isMatch = await bcrypt.compare(password, user.pw);
        if (!isMatch) {
          return res.status(401).json({ message: "비밀번호가 틀립니다." });
        }

        const findShop = await Shop.findOne({ where: { owner_id: user.id } });

        console.log("값 확인 = ", findShop);

        req.session.user = {
          id: user.id,
          userid: user.userid,
          membershipType: user.membershipType,
        };

        console.log(req.session.user);
        console.log("세션 후");

        return res.status(200).json({
          message: "로그인 성공",
          membershipType: user.membershipType,
          isSuccess: true,
          id: user.id,
          nickname: user.nickname,
          user_id: user.userid,
          type: user.membershipType,
          phone: user.phone,
          shopId: findShop.id,
          shopOwnerLoginId: findShop.owner_id,
        });
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      return res
        .status(500)
        .json({ message: "로그인 중 오류가 발생했습니다." });
    }
  }
};

// 사용자 프로필 업데이트
exports.updateUserProfile = async (req, res) => {
  const {
    nickname,
    email,
    password,
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
    membershipType,
  } = req.body;

  try {
    let user;

    if (membershipType === "individual") {
      user = await Customer.findOne({ where: { nickname } });
    } else if (membershipType === "business") {
      user = await Owner.findOne({
        where: { userid: req.session.user.user_id },
      });
    } else {
      return res
        .status(400)
        .json({ message: "유효하지 않은 회원 유형입니다." });
    }

    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    if (email) user.email = email;

    if (password && newPassword) {
      const isMatch = await bcrypt.compare(password, user.pw);
      if (!isMatch) {
        return res.status(401).json({ message: "기존 비밀번호가 틀립니다." });
      }
      user.pw = await bcrypt.hash(newPassword, 10);
    }

    if (name) user.name = name;
    if (gender) user.gender = gender;
    if (phoneNumber) user.phone = phoneNumber;
    if (address) user.address = address;

    if (membershipType === "business") {
      if (companyName) user.ownerShopname = companyName;
      if (businessType) user.ownerShoptype = businessType;
      if (storeAddress) user.ownerShopaddress = storeAddress;
      if (representativeName) user.representativeName = representativeName;
      if (businessRegistrationNumber)
        user.businessNumber = businessRegistrationNumber;
    }

    await user.save();
    return res.status(200).json({ message: "프로필이 업데이트되었습니다." });
  } catch (error) {
    console.error("프로필 업데이트 오류:", error);
    return res
      .status(500)
      .json({ message: "프로필 업데이트 중 오류가 발생했습니다." });
  }
};

// 사용자 탈퇴 핸들러
exports.deleteUser = async (req, res) => {
  const { nickname } = req.params;

  try {
    let user = await Customer.findOne({ where: { nickname } });

    if (membershipType === "individual") {
      user = await Customer.findOne({ where: { nickname: username } });
      if (user) {
        await Customer.destroy({ where: { nickname: username } });
        console.log(`삭제됨: 일반회원 (${username})`);
        return res.status(200).json({ message: "사용자가 탈퇴되었습니다." });
      }
    } else if (membershipType === "business") {
      user = await Owner.findOne({ where: { userid: username } });
      if (user) {
        await Owner.destroy({ where: { userid: username } });
        console.log(`삭제됨: 점주회원 (${username})`);
        return res.status(200).json({ message: "사용자가 탈퇴되었습니다." });
      }
    } else {
      return res
        .status(400)
        .json({ message: "유효하지 않은 회원 유형입니다." });

    }

    return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });


      if (!user) {
        // 만약 일반회원이 아니라면 비즈니스 회원도 체크
        user = await Owner.findOne({ where: { userid: nickname } }); // userid로 변경
        if (user) {
          await Owner.destroy({ where: { userid: nickname } });
          console.log(`삭제됨: 점주회원 (${nickname})`);
          return res.status(200).json({ message: "사용자가 탈퇴되었습니다." });
        }
      }

      if (user) {
        await Customer.destroy({ where: { nickname } });
        console.log(`삭제됨: 일반회원 (${nickname})`);
        return res.status(200).json({ message: "사용자가 탈퇴되었습니다." });
      }

      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

  } catch (error) {
    console.error("사용자 탈퇴 오류:", error);
    return res
      .status(500)
      .json({ message: "사용자 탈퇴 중 오류가 발생했습니다." });
  }
};

// 로그아웃
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "로그아웃 중 오류가 발생했습니다." });
    }
    res.status(200).json({ message: "로그아웃 성공" });
  });
};

// 로그인한 사용자 정보 가져오기
exports.getUserProfile = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }

  const userId = req.session.user.id;
  const membershipType = req.session.user.membershipType;

  try {
    let user;

    // 회원 유형에 따라 적절한 테이블에서 사용자 조회
    if (membershipType === "individual") {
      user = await Customer.findOne({ where: { id: userId } });
    } else if (membershipType === "business") {
      user = await Owner.findOne({ where: { id: userId } });
    }

    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    return res.status(200).json({
      message: "사용자 프로필 조회 성공",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        address: user.address,
        join_date: user.join_date,
        membershipType: user.membershipType,
        // 점주회원일 경우 추가 정보
        ...(membershipType === "business" && {
          businessNumber: user.businessNumber,
          ownerShopname: user.ownerShopname,
          ownerShopaddress: user.ownerShopaddress,
          ownerShoptype: user.ownerShoptype,
          representativeName: user.representativeName,
        }),
      },
    });
  } catch (error) {
    console.error("사용자 프로필 조회 오류:", error);
    return res
      .status(500)
      .json({ message: "사용자 프로필 조회 중 오류가 발생했습니다." });
  }
};

// 현재 비밀번호 확인
exports.checkPassword = async (req, res) => {
  const { currentPassword } = req.body;

  if (!req.session.user) {
    return res
      .status(401)
      .json({ success: false, message: "로그인이 필요합니다." });
  }

  const userId = req.session.user.id;
  const membershipType = req.session.user.membershipType;

  try {
    let user;

    // 회원 유형에 따라 적절한 테이블에서 사용자 조회
    if (membershipType === "individual") {
      user = await Customer.findOne({ where: { id: userId } });
    } else if (membershipType === "business") {
      user = await Owner.findOne({ where: { id: userId } });
    }

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "사용자를 찾을 수 없습니다." });
    }

    // 비밀번호 확인
    const isMatch = await bcrypt.compare(currentPassword, user.pw);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "비밀번호가 틀립니다." });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("비밀번호 확인 오류:", error);
    return res.status(500).json({
      success: false,
      message: "비밀번호 확인 중 오류가 발생했습니다.",
    });
  }
};
