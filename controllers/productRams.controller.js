import ProductRamsModel from "../models/productRams.js";

export async function createProductRamsController(req, res) {
  let productRams = new ProductRamsModel({
    name: req.body.name
  })

  const saveProductRams = await productRams.save()

  if (!saveProductRams) {
    res.status(500).json({
      error: true,
      success: false,
      message: "Product Rams not created"
    })
  }

  return res.status(200).json({
    message: "Product RAMS created successfully",
    error: false,
    success: true,
    productRams: saveProductRams
  })
}

export async function deleteProductRamsControllers(req, res) {
  const productRams = await ProductRamsModel.findById(req.params.id);

  if (!productRams) {
    return res.status(404).json({
      message: "Product RAM not found",
      error: true,
      success: false
    })
  }

  const deleteProductRams = await ProductRamsModel.findByIdAndDelete(req.params.id);

  if (!deleteProductRams) {
    res.status(401).json({
      message: "Product RAM not deleted",
      success: false,
      error: true
    })
  }

  return res.status(200).json({
    message: "Product RAM deleted",
    success: true,
    error: false
  })
}

export async function deleteMultipleProductRamsController(req, res) {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids)) {
    return res.status(400).json({
      message: "Invalid input",
      success: false,
      error: true
    })
  }

  try {
    await ProductRamsModel.deleteMany({ _id: { $in: ids } });
    return res.status(200).json({
      message: "Product RAMS deleted successfully",
      success: true,
      error: false
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true
    })
  }
}

export async function updateProductRamController(req, res) {
  const productRam = await ProductRamsModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name
    },
    { new: true }
  )

  if (!productRam) {
    return res.status(401).json({
      message: "The product RAM cannot be updated!",
      success: false,
      error: true
    })
  }

  return res.status(200).json({
    message: "The product RAM is updated",
    success: true,
    error: false
  })
}

export async function getProductRamsControllers(req, res) {
  const productRams = await ProductRamsModel.find();

  if (!productRams) {
    return res.status(401).json({
      message: "Product RAM is not available",
      error: true,
      success: false
    })
  }

  return res.status(200).json({
    data: productRams,
    error: false,
    success: true
  })
}

export async function getProductRamById(req, res) {
  const productRam = await ProductRamsModel.findById({ _id: req.params.id })
  if (!productRam) {
    return res.status(401).json({
      message: "Did not find the Product Ram",
      error: true,
      success: false
    })
  }

  return res.status(201).json({
    data: productRam,
    error: false,
    success: true
  })
}