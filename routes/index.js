const express = require('express');
const router = express.Router();
const controller = require('../controller/Cmain');
const income = require('../controller/Income');
const review = require('../controller/Review');
const menu = require('../controller/Cmenu');
const userController = require('../controller/UserController');

// GET /api-server
router.get('/', controller.getIndex);

// GET /api-server/owner
router.get('/owner', controller.getOwner);

// POST /api-server/income
router.post('/income', income.income);

// GET /api-sever/owner-review
router.get('/owner-review', review.getOwnerReview);

//GET /api-server/menu-list
router.get('/menu-list', menu.getMenus);

//POST /api-server/menu-register
router.post('/menu-register', menu.createMenus);

// 회원가입
router.post('/signup', userController.signUp);

// 로그인
router.post('/login', userController.login);

// 이메일 중복 확인
// router.get('/check-email', userController.checkEmailExists);

// 비밀번호 재설정
router.post('/reset-password', userController.resetPassword);

// 로그인한 사용자 정보 가져오기
router.get('/me/:userId', userController.getUserProfile);

// 사용자 탈퇴
router.delete('/:username', userController.deleteUser);

// 인증 상태 확인
router.get('/auth-status', userController.checkOwnerAuthStatus);

// 사용자 프로필 수정
router.put('/update/:username', userController.updateProfile);

// 사용자 역할 관리
router.put('/role', userController.updateOwnerRole);

// 프로필 이미지 업로드
router.post(
  '/upload-profile-image/:username',
  userController.uploadOwnerProfileImage,
);

module.exports = router;
