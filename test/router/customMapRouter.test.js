const expect = require("chai").expect;
const request = require("supertest");

const app = require("../../app");
const CustomMap = require("../../model/CustomMap");
const {
  validMockCustomMap,
  validMockCustomMap2,
  invalidMockCustomMap,
} = require("../mockData");

describe("customMapRouter TEST", () => {
  describe("GET /", () => {
    it("should respond with 200 and get Custom Map", async () => {
      const response = await request(app).get(`/customMap`);
      expect(response.status).to.equal(200);
      expect(response.body.result).to.equal("ok");
      expect(response.body.customMapList.length).to.equal(1);
      expect(response.body.customMapList[0]).include({
        _id: validMockCustomMap._id,
        mapName: validMockCustomMap.mapName,
        maker: validMockCustomMap.maker,
        createdAt: validMockCustomMap.createdAt,
      });
      expect(response.body.customMapList[0].nodeList)
        .to.have.nested.property("allIds")
        .deep.equal(validMockCustomMap.nodeList.allIds);
      expect(response.body.customMapList[0].nodeList)
        .to.have.nested.property("byId")
        .deep.equal(validMockCustomMap.nodeList.byId);
    });

    it("should respond with 200 and empty of Array", async () => {
      await CustomMap.deleteMany({});
      const response = await request(app).get(`/customMap`);

      expect(response.status).to.equal(200);
      expect(response.body.result).to.equal("ok");
      expect(response.body.customMapList.length).to.equal(0);
    });
  });

  describe("Post /", () => {
    it("should respond with 200 and Custom Map is saved in the database.", async () => {
      const response = await request(app)
        .post("/customMap")
        .send(validMockCustomMap2);

      expect(response.status).to.equal(200);
      expect(response.body.result).to.equal("ok");
      expect(response.body.customMapInfo).to.include({
        mapName: validMockCustomMap2.mapName,
        maker: validMockCustomMap2.nickname,
      });
      expect(response.body.customMapInfo.nodeList)
        .to.have.nested.property("allIds")
        .deep.equal(validMockCustomMap2.nodeList.allIds);
      expect(response.body.customMapInfo.nodeList)
        .to.have.nested.property("byId")
        .deep.equal(validMockCustomMap2.nodeList.byId);
    });

    it("Custom Map should not be saved in the database with invalid data", async () => {
      const invalidMockData = invalidMockCustomMap;

      const response = await request(app)
        .post("/customMap")
        .send(invalidMockData);

      expect(response.status).to.equal(500);
      expect(response.body.result).to.equal("error");
    });
  });
});
