const express = require("express");

const {
  saveCustomMap,
  getCustomMapList,
} = require("../controller/custonMapController");
const router = express.Router();

router.get("/", getCustomMapList);

router.post("/", saveCustomMap);

module.exports = router;
