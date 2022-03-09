const mongoose = require("mongoose");

const customMapSchema = new mongoose.Schema({
  mapName: {
    type: String,
    required: true,
  },
  nodeList: {
    allIds: {
      type: [Array],
      required: true,
    },
    byId: {
      type: Object,
      required: true,
    },
  },
  maker: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
});

customMapSchema.index({ count: -1 });

module.exports = mongoose.model("CustomMap", customMapSchema);
