const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PriceInfoSchema = new Schema(
  {
    btcprice: {
      type: Number     
    },   
  },
  { timestamps: true }
);

module.exports = PriceInfo = mongoose.model("priceinfos", PriceInfoSchema);