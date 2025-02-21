const express = require("express");
const router = express.Router();
const controller = require("../controller/Cmain");
const income = require("../controller/Income");
const review = require("../controller/Review");
const menu = require("../controller/Cmenu");

// GET /api-server
router.get("/", controller.getIndex);

// GET /api-server/owner
router.get("/owner", controller.getOwner);

// POST /api-server/income
router.post("/income", income.income);

// GET /api-sever/owner-review
router.get("/owner-review", review.getOwnerReview);

//GET /api-server/menu-list
router.get("/menu-list", menu.getMenus);

//POST /api-server/menu-register
router.post("/menu-register", menu.createMenus);

module.exports = router;
