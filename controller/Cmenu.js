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
  console.log(req.query);

  const { shopId, owner_id } = req.query;

  console.log("이것은 shopId", shopId);
  console.log("이것은 owner_id", owner_id);
  //스타벅스(서브 가게)에 메뉴를 추가하고 나면 shopId가 전달되지 않는다.
  //좀 더 정확히는, shopId가 텅 비어있는 상태다. undefined
  //그렇다면, Menus 페이지에 있는 crossId가 undefined가 된다는 뜻.
  //아마 원인은 이것 같다. useLocation.
  //저건 처음 선택했을 때만 값을 넘겨준다. 그래서 선택하지 않은 상태에서
  //메뉴를 불러오는 쿼리를 실행시키려고 하면,
  //useLocation이 소용없기 때문에, crossId도 텅 빈 값이 되고, shopId도 빈 값이 된다.
  //shopId를 다른 방법으로 가져오게 해야 할 것 같은데.
  //그런데 select로 선택한 값을 사용해야 하기는 한다.
  //shopId를 어디서든 사용할 수 있게 하면서, select에 따라 유동적으로 변하도록

  const findShop = await Shop.findAll({
    where: {
      owner_id: owner_id,
    },
  });
  console.log("이건 findShop: ", findShop[0].dataValues);
  //이 findShop 안의 id를 보내줘야 할까?
  const { id } = findShop[0].dataValues;
  console.log("findShop에서 뽑아낸 가게의 id", id);

  const findMenus = await Menu.findAll({
    where: {
      shop_menu_id: shopId,
    },
  });
  console.log("메뉴 조회!");
  res.send(findMenus);
};

exports.createMenus = async (req, res) => {
  console.log("여기는 createMenus");
  console.log("이것은 req.body이다.", req.body);

  try {
    // const owner_id = Number(req.body.owner_id);
    // console.log("이것은 id다", owner_id);
    // const findShopId = await Shop.findOne({
    //   where: {
    //     owner_id: owner_id,
    //   },
    // });
    // console.log("이것이 findShopId", findShopId);
    // const { id } = findShopId;
    // console.log("shop의 id: ", id);

    const shopId = Number(req.body.shopId);
    console.log("createMenus 안의 ShopId", shopId);

    const decodeFile = Buffer.from(req.file.originalname, "binary").toString(
      "utf-8"
    );

    if (req.file) {
      const fileUrl = await uploadFile(req.file);
      const s3File = fileUrl.split("/")[3];
      const s3Url = fileUrl.split(s3File)[0];
      const insertMenus = await Menu.create({
        shop_menu_id: shopId, //id가 과연...
        // shop_menu_id: 2, //id가 과연...
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
    const owner_id = Number(req.body.owner_id);
    console.log("이것은 id다", owner_id);
    const findShopId = await Shop.findOne({
      where: {
        owner_id: owner_id,
      },
    });
    console.log("이것이 findShopId", findShopId);
    const { id } = findShopId;
    console.log("shop의 id: ", id);
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
          shop_menu_id: id,
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
  const { owner_id } = req.body;
  try {
    const addshop = await Shop.create({
      owner_id: owner_id, //임시값
      shopName: req.body.sname,
      businessNumber: req.body.sbrn,
      shopAddress: req.body.saddress,
      shopPhone: req.body.sphone,
      shopType: req.body.stype,
      shopOwner: req.body.sowner,
    });
    if (addshop) {
      res.send({ isAdd: true });
    } else {
      res.send({ isAdd: false });
    }
  } catch (err) {
    console.log("error!!:", err);
    res.send({ isAdd: false });
  }
};
