const express = require("express");
const router = express.Router();
const controller = require("../controller/Cmain");
const income = require("../controller/Income");
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

module.exports = router;
