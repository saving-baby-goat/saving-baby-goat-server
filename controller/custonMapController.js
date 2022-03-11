const { createCustomMap, findcustomMapList } = require("../service/custonMap");
const { RESPONSE_RESULT, ERROR_MESSAGES } = require("../utills/constants");
const ErrorWithStatus = require("../utills/ErrorwithStatus");

exports.saveCustomMap = async (req, res, next) => {
  try {
    const { mapName, nodeList, nickname } = req.body;

    const newCustomMap = {
      mapName,
      nodeList,
      maker: nickname,
      createdAt: new Date().toISOString(),
    };

    const createdCustomMapInfo = await createCustomMap(newCustomMap);

    res.json({
      result: RESPONSE_RESULT.OK,
      customMapInfo: createdCustomMapInfo,
    });
  } catch (error) {
    next(
      new ErrorWithStatus(
        error,
        500,
        RESPONSE_RESULT.ERROR,
        ERROR_MESSAGES.FAILED_TO_CREATE_CUSTOM_MAP
      )
    );
  }
};

exports.getCustomMapList = async (req, res, next) => {
  try {
    const customMapList = await findcustomMapList();

    res.json({
      result: RESPONSE_RESULT.OK,
      customMapList,
    });
  } catch (error) {
    next(
      new ErrorWithStatus(
        error,
        500,
        RESPONSE_RESULT.ERROR,
        ERROR_MESSAGES.FAILED_TO_GET_CUSTOM_MAP_LIST
      )
    );
  }
};
