require("dotenv").config();
require("./config/mongoose");

const path = require("path");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const logger = require("morgan");

const indexRouter = require("./routes/index");

const corsOptions = {
  origin: process.env.CORS_ORIGIN_URL,
  credentials: true,
};

const app = express();

app.use(helmet());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors(corsOptions));

app.use("/", indexRouter);

app.use(function (error, req, res, next) {
  res.status(error.status || 500);
  res.json({
    result: error.result,
    errMessage: error.message,
  });
});

module.exports = app;
