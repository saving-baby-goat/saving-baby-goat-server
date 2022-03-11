const mongoose = require("mongoose");

const CustomMap = require("../model/CustomMap");
const { validMockCustomMap } = require("./mockData");

exports.mochaHooks = {
  async beforeAll() {
    mongoose.connect(process.env.TEST_DB_LOCAL_URL);

    await CustomMap.create(validMockCustomMap);
  },
  async afterEach() {
    const collections = Object.keys(mongoose.connection.collections);

    for (const collectionName of collections) {
      if (collectionName === "customMaps") {
        await CustomMap.deleteMany({ _id: { $ne: validMockCustomMap._id } });
      }
    }
  },
  async afterAll() {
    const collections = Object.keys(mongoose.connection.collections);

    for (const collectionName of collections) {
      const collection = mongoose.connection.collections[collectionName];
      await collection.deleteMany();
    }

    Object.keys(mongoose.connection.models).forEach((modelName) => {
      delete mongoose.connection.models[modelName];
    });
  },
};
