const { Menu, Shop } = require("../models");
//s3 버전업
const fs = require("fs");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  },
});

//버전업
const uploadFile = async (file) => {
  try {
    const fileContent = fs.readFileSync(file.path); // 파일 경로
    const decodeFile = Buffer.from(file.originalname, "binary").toString(
      "utf-8"
    );

    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `${Date.now()}-${decodeFile}`, // 파일 이름 설정
      Body: fileContent,
      ACL: "public-read", // 파일 접근 권한 설정
    };

    const command = new PutObjectCommand(uploadParams);
    const data = await s3.send(command);

    console.log("Success", data);
    return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${uploadParams.Key}`;
  } catch (err) {
    console.log("Error", err);
  }
};
//버전업 끝

exports.getMenus = async (req, res) => {
  console.log("여기는 getMenus");
  const findMenus = await Menu.findAll();
  console.log("메뉴 조회!");
  res.send(findMenus);
};

exports.createMenus = async (req, res) => {
  console.log("여기는 createMenus");
  console.log("이것은 req.body이다.", req.body);
  console.log("이것은 req.session.user: ", req.session);

  try {
    // const { id } = req.session.user;
    // console.log(id);
    // const findShopId = await Shop.findOne({
    //   where: {
    //     owner_id: id,
    //   },
    // });
    // console.log(findShopId);

    // const { shopid } = findShopId.data;

    console.log("이것이 req.file", req.file);
    const decodeFile = Buffer.from(req.file.originalname, "binary").toString(
      "utf-8"
    );
    console.log("인코딩을 하자! :", decodeFile);
    //버전업
    if (req.file) {
      console.log("이것은 req.file이다.", req.file);
      const fileUrl = await uploadFile(req.file);
      const s3File = fileUrl.split("/")[3];
      const s3Url = fileUrl.split(s3File)[0];
      const insertMenus = await Menu.create({
        // shop_menu_id: shopid, //id가 과연...
        shop_menu_id: 2, //id가 과연...
        menuName: req.body.mname,
        price: Number(req.body.mprice),
        menudesc: req.body.mdesc,
        category: req.body.mcategory,
        originMfile: decodeFile,
        saveMfile: encodeURIComponent(s3File),
      });
      res.send({ insertMenus, isUpdate: true, s3Url });
    } else {
      res.send({ isUpdate: false });
    }
  } catch (err) {
    console.log("err!:", err);
  }
};

//메뉴 정보 수정
exports.updateMenus = async (req, res) => {
  console.log("여기는 updateMenus");
  console.log(req.body);

  try {
    const { userid } = req.session.user;
    const findShopId = await Shop.findOne({
      where: {
        owner_id: userid,
      },
    });
    console.log(findShopId);

    const { shopid } = findShopId.data;
    const decodeFile = Buffer.from(req.file.originalname, "binary").toString(
      "utf-8"
    );
    console.log("인코딩을 하자! :", decodeFile);
    //버전업
    if (req.file) {
      console.log("이것은 req.file이다.", req.file);
      const fileUrl = await uploadFile(req.file);
      console.log(fileUrl);
      const s3File = fileUrl.split("/")[3];
      const s3Url = fileUrl.split(s3File)[0];
      const chgMenus = await Menu.update(
        {
          shop_menu_id: shopid,
          menuName: req.body.chgname,
          price: Number(req.body.chgprice),
          menudesc: req.body.chgdesc,
          category: req.body.chgcategory,
          originMfile: decodeFile,
          saveMfile: encodeURIComponent(s3File),
        },
        {
          where: {
            id: req.body.id,
          },
        }
      );
      res.send({ chgMenus, isUpdate: true, s3Url });
    }
  } catch (err) {
    console.log("err", err);
  }
};

exports.deleteMenu = async (req, res) => {
  try {
    console.log(req.body);
    const throwMenu = await Menu.destroy({
      where: {
        id: req.body.id,
      },
    });
    res.send({ isDelete: true });
  } catch (err) {
    console.log("delete 에러입니다!!:", err);
    res.send({ isDelete: false });
  }
};

//가게 등록 컨트롤러
//어디다 적어놔야 하지
exports.createShop = async (req, res) => {
  console.log("여기는 createShop");
  try {
    const addshop = await Shop.create({
      owner_id: 1, //임시값
      shopName: req.body.sname,
      businessNumber: req.body.sbrn,
      shopAddress: req.body.saddress,
      shopPhone: req.body.sphone,
      shopType: req.body.stype,
      shopOwner: req.body.sowner,
    });

    res.send({ isAdd: true });
  } catch (err) {
    console.log("error!!:", err);
    res.send({ isAdd: false });
  }
};
