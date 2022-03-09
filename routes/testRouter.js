const express = require("express");

const { RESPONSE_RESULT } = require("../utills/constants");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.json({
    result: RESPONSE_RESULT.OK,
  });
});

module.exports = router;
