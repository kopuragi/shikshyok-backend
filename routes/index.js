const express = require("express");
const router = express.Router();
const controller = require("../controller/Cmain");
const income = require("../controller/Income");
// GET /api-server
router.get("/", controller.getIndex);
router.post("/income", income.income);
module.exports = router;
