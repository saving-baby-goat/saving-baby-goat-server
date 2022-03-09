const CustomMap = require("../model/CustomMap");

exports.createCustomMap = async (newCustomMap) => {
  return await CustomMap.create(newCustomMap);
};

exports.findcustomMapList = async () => {
  return await CustomMap.find({}).sort("-count");
};

exports.increaseCustomMapPlayCount = async (id) => {
  return await CustomMap.findByIdAndUpdate({ _id: id }, { $inc: { count: 1 } });
};
