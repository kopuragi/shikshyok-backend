const express = require("express");
const router = express.Router();
const controller = require("../controller/Cmain");
const income = require("../controller/Income");
const review = require("../controller/Review");
const menu = require("../controller/Cmenu");
const userController = require("../controller/UserController");
//s3설정
const multer = require("multer");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
//버전업

const upload = multer({ dest: "uploads/" });

// GET /api-server
router.get("/", controller.getIndex);

// GET /api-server/owner
router.get("/owner", controller.getOwner);

// POST /api-server/income/orderMenu
router.post("/income/orderMenu", income.orderMenu);
// POST /api-server/income/orderVisitor
router.post("/income/orderVisitor", income.orderVisitor);
// POST /api-server/income/reVisitor
router.post("/income/reVisitor", income.reVisitor);

// POST /api-server/income
// router.post("/income", income.income);

// GET /api-server/owner-review
router.get("/owner-review", review.getOwnerReview);

// PATCH /api-server/owner-review/:id
router.patch("/owner-review/:id", review.updateOwnerReview);

// PATCH /api-server/owner-review (고객리뷰 삭제요청)
router.patch("/owner-review", review.CusReviewDelete);

// DELETE /api-server/owner-review/:id
router.delete("/owner-review/:id", review.deleteOwnerReview);

// GET /api-server/menu-list
router.get("/menu-list", menu.getMenus);

// POST /api-server/menu-register
router.post("/menu-register", upload.single("image"), menu.createMenus);

// PATCH /api-server/menu-change
router.patch("/menu-change", upload.single("image"), menu.updateMenus);

// DELETE /api-server/menu-delete
router.delete("/menu-delete", menu.deleteMenu);

//POST /api-server/shop-register
router.post("/shop-register", menu.createShop);

// 회원가입
router.post("/signup", userController.signUp);

// 로그인
router.post("/login", userController.login);

// 로그인한 사용자 정보 가져오기
router.get("/me", userController.getUserProfile);

// 사용자 탈퇴
router.delete("/delete/:nickname", userController.deleteUser);

// 사용자 프로필 수정
router.put("/update", userController.updateUserProfile);

// 로그아웃 (DELETE 메소드 사용)
router.delete("/logout", userController.logout);

// 현재 비밀번호 확인 라우트 추가
router.post("/check-password", userController.checkPassword);

module.exports = router;
