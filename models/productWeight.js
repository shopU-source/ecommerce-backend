import mongoose from "mongoose";

const productWeightSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

const ProductWeightModel = mongoose.model("productWeight", productWeightSchema)
export default ProductWeightModel;