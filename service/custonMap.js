const CustomMap = require("../model/CustomMap");

exports.createCustomMap = async (newCustomMap) => {
  return await CustomMap.create(newCustomMap);
};
