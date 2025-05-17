import ProductSizeModel from "../models/productSize.js";

export async function createProductSizeController(req, res) {
  let productSize = new ProductSizeModel({
    name: req.body.name
  })

  const saveProductSize = await productSize.save()

  if (!saveProductSize) {
    res.status(500).json({
      error: true,
      success: false,
      message: "Product size not created"
    })
  }

  return res.status(200).json({
    message: "Product size created successfully",
    error: false,
    success: true,
    productSize: saveProductSize
  })
}

export async function deleteProductSizeControllers(req, res) {
  const productSize = await ProductSizeModel.findById(req.params.id);

  if (!productSize) {
    return res.status(404).json({
      message: "Product size not found",
      error: true,
      success: false
    })
  }

  const deleteProductSize = await ProductSizeModel.findByIdAndDelete(req.params.id);

  if (!deleteProductSize) {
    res.status(401).json({
      message: "Product size not deleted",
      success: false,
      error: true
    })
  }

  return res.status(200).json({
    message: "Product size deleted",
    success: true,
    error: false
  })
}

export async function updateProductSizeController(req, res) {
  const productSize = await ProductSizeModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name
    },
    { new: true }
  )

  if (!productSize) {
    return res.status(401).json({
      message: "The product size cannot be updated!",
      success: false,
      error: true
    })
  }

  return res.status(200).json({
    message: "The product size is updated",
    success: true,
    error: false
  })
}

export async function getProductSizeControllers(req, res) {
  const productSize = await ProductSizeModel.find();

  if (!productSize) {
    return res.status(401).json({
      message: "Product size is not available",
      error: true,
      success: false
    })
  }

  return res.status(200).json({
    data: productSize,
    error: false,
    success: true
  })
}

export async function getProductSizeById(req, res) {
  const productSize = await ProductSizeModel.findById(req.params.id)
  if (!productSize) {
    return res.status(401).json({
      message: "Did not find the Product size",
      error: true,
      success: false
    })
  }

  return res.status(201).json({
    data: productSize,
    error: false,
    success: true
  })
}