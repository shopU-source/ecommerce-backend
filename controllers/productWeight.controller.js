import ProductWeightModel from "../models/productWeight.js";

export async function createProductWeightController(req, res) {
  let productWeight = new ProductWeightModel({
    name: req.body.name
  })

  const saveProductWeight = await productWeight.save();

  if (!saveProductWeight) {
    res.status(201).json({
      error: true,
      success: false,
      message: "Product Weight not created"
    })
  }

  return res.status(200).json({
    message: "Product Weight created successfully",
    error: true,
    success: true,
    productWeight: saveProductWeight
  })
}

export async function deleteProductWeightControllers(req, res) {
  const productWeight = await ProductWeightModel.findById(req.params.id);

  if (!productWeight) {
    return res.status(401).json({
      message: "Product weight not found",
      error: true,
      success: false
    })
  }

  const deleteProductWeight = await ProductWeightModel.findByIdAndDelete(req.params.id);

  if (!deleteProductWeight) {
    res.status(401).json({
      message: "Product Weight not deleted",
      success: false,
      error: true
    })
  }

  return res.status(201).json({
    message: "Product Weight deleted",
    success: true,
    error: false
  })
}

export async function updateProductWeightController(req, res) {
  const productWeight = await ProductWeightModel.findByIdAndUpdate(req.params.id,
    {
      name: req.body.name
    },
    { new: true }
  )

  if (!productWeight) {
    return res.status(401).json({
      message: "The product Weight cannot be updated!",
      success: false,
      error: true
    })
  }

  return res.status(201).json({
    message: "The product weight is updated",
    success: true,
    error: false
  })
}

export async function getProductWeightControllers(req, res) {
  const productWeight = await ProductWeightModel.find();

  if (!productWeight) {
    return res.status(401).json({
      message: "Product weight is not available",
      error: true,
      success: false
    })
  }

  return res.status(200).json({
    data: productWeight,
    success: true,
    error: false
  })
}

export async function getProductWeightById(req, res) {
  const productWeight = await ProductWeightModel.findById(req.params.id);

  if (!productWeight) {
    return res.status(401).json({
      message: "Did not find the product weight",
      success: false,
      error: true
    })
  }

  return res.status(201).json({
    data: productWeight,
    success: true,
    error: false
  })
}