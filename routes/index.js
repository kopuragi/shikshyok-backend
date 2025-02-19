const express = require("express");
const router = express.Router();
const controller = require("../controller/Cmain");
const income = require("../controller/Income");
// GET /api-server
router.get("/", controller.getIndex);

// GET /api-server/owner
router.get("/owner", controller.getOwner);

// POST /api-server/income
router.post("/income", income.income);


module.exports = router;
