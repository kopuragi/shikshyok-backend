const { Menu, Menufile } = require("../models");

exports.getMenus = async (req, res) => {
  console.log("여기는 getMenus");
  const findMenus = await Menu.findAll();
  const findMenufiles = await Menufile.findAll();
  console.log("메뉴 조회!");
  console.log(findMenus);
  console.log(findMenufiles);
  res.send("요청 성공");
};

exports.createMenus = async (req, res) => {
  console.log("여기는 createMenus");
  console.log(req.body);
  const insertMenus = await Menu.create({
    menuName: req.body.mname,
    price: req.body.mprice,
    desc: req.body.mcontent,
    category: req.body.mcategory,
  });
  //   const insertMenufile = await Menufile.create({});
  console.log(insertMenus);
  res.send("요청 성공");
};
