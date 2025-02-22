const { Menu, Menufile, Shop } = require("../models");

exports.getMenus = async (req, res) => {
  console.log("여기는 getMenus");
  const findMenus = await Menu.findAll();
  const findMenufiles = await Menufile.findAll();
  console.log("메뉴 조회!");
  console.log(findMenus);
  console.log(findMenufiles);
  res.send(findMenus);
};

exports.createMenus = async (req, res) => {
  console.log("여기는 createMenus");
  console.log(req.body);
  const { userid } = req.session.user;
  const findShopId = await Shop.findOne({
    where: {
      owner_id: userid,
      //세션에 저장된 userid를 조회해서
      //shop 정보를 가지고 온다.
      //shop_menu_id를 적는 데에 사용
      //shop의 owner_id가
      //customer의 userid가 같으면 된다.
    },
  });
  console.log(findShopId); //findShopId에 shop 정보가 잘 나오는지 확인하자

  const { shopid } = findShopId.data; //이게 맞나?

  const insertMenus = await Menu.create({
    shop_menu_id: shopid,
    //맞는지 확인해보지는 않았다.
    //세션 저장이 완료되면 확인해봐야겠다.
    menuName: req.body.mname,
    price: Number(req.body.mprice),
    menudesc: req.body.mdesc,
    category: req.body.mcategory,
  });
  //   const insertMenufile = await Menufile.create({});
  console.log(insertMenus);
  // res.send("요청 성공");
  res.sendL({ insertMenus });
};
