const { Menu, Shop } = require("../models");

exports.getMenus = async (req, res) => {
  console.log("여기는 getMenus");
  const findMenus = await Menu.findAll();
  console.log("메뉴 조회!");
  res.send(findMenus);
};

exports.createMenus = async (req, res) => {
  console.log("여기는 createMenus");
  console.log(req.body);
  try {
    // const { userid } = req.session.user;
    // const findShopId = await Shop.findOne({
    //   where: {
    //     owner_id: userid,
    //   },
    // });
    // console.log(findShopId);

    // const { shopid } = findShopId.data;

    const insertMenus = await Menu.create({
      shop_menu_id: 2,
      //일단 임시로 아이디 값을 고정값으로 줬다.
      //세션에 저장된 회원 아이디를 사용해서 유동적으로 가져와야 한다.
      //데이터를 등록하는 기능 자체는 문제가 없다.
      menuName: req.body.mname,
      price: Number(req.body.mprice),
      menudesc: req.body.mdesc,
      category: req.body.mcategory,
      originMfile: req.body.mfile,
    });
    const imgUrl = req.file.location;

    console.log(req.file); //파일이 제대로 들어오고 있나

    console.log(insertMenus);
    res.send({ insertMenus, imgUrl });
  } catch (err) {
    console.log("err!:", err);
  }
};

//s3에 이미지 업로드
// exports.fileupload = async (req, res) => {
//   console.log("여기는 fileupload");
//   console.log(req.file.location);
//   res.send({ imgUrl });
// };

//메뉴 정보 수정
exports.updateMenus = async (req, res) => {
  console.log("여기는 updateMenus");
  console.log(req.body);

  try {
    // const { userid } = req.session.user;
    // const findShopId = await Shop.findOne({
    //   where: {
    //     owner_id: userid,
    //   },
    // });
    // console.log(findShopId);

    // const { shopid } = findShopId.data;
    const chgMenus = await Menu.update(
      {
        menuName: req.body.chgname,
        price: Number(req.body.chgprice),
        menudesc: req.body.chgdesc,
        category: req.body.chgcategory,
        originMfile: req.body.chgfile,
      },
      {
        where: {
          id: req.body.id,
        },
      }
    );

    const imgUrl = req.file.location;

    console.log(req.file); //파일이 제대로 들어오고 있나

    res.send({ chgMenus, imgUrl });
  } catch (err) {
    console.log("err", err);
  }
};
