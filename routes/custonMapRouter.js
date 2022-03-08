const express = require("express");

const { saveCustomMap } = require("../controller/custonMapController");
const router = express.Router();

router.get("/", (req, res, next) => {});

router.post("/", saveCustomMap);

module.exports = router;
