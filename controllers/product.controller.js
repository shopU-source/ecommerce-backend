import ProductModel from "../models/product.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { config } from "dotenv";
config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_APIKEY,
  api_secret: process.env.CLOUDINARY_CLOUD_APISECRET,
  secure: true,
});

let imagesArray = [];
export async function productImageUpload(req, res) {
  const images = req.files;

  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: false,
  };

  for (let i = 0; i < images?.length; i++) {
    await cloudinary.uploader.upload(
      images[i].path,
      options,
      function (error, result) {
        console.log(result);
        imagesArray.push(result.secure_url);
        fs.unlinkSync(`uploads/${images[i].filename}`);
        console.log(images[i].filename);
      }
    );
  }

  return res.status(200).json({
    images: imagesArray[0],
  });
}

export async function createProductController(req, res) {
  let product = new ProductModel({
    name: req.body.name,
    description: req.body.description,
    images: imagesArray,
    brand: req.body.brand,
    price: req.body.price,
    oldPrice: req.body.oldPrice,
    categoryName: req.body.categoryName,
    categoryId: req.body.categoryId,
    subCategoryId: req.body.subCategoryId,
    subCategory: req.body.subCategory,
    thirdSubCategory: req.body.thirdSubCategory,
    thirdSubCategoryId: req.body.thirdSubCategoryId,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    isFeatured: req.body.isFeatured,
    discount: req.body.discount,
    productRam: req.body.productRam,
    size: req.body.size,
    productWeight: req.body.productWeight,
  });

  product = await product.save();

  if (!product) {
    return res.status(200).json({
      message: "Product not created",
      error: true,
      success: false,
    });
  }

  imagesArray = [];

  return res.status(200).json({
    message: "Product created successfully",
    success: true,
    error: false,
  });
}

export async function getAllProductsController(req, res) {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage);
  const totalPosts = await ProductModel.countDocuments();
  const totalPages = Math.ceil(totalPosts / perPage);

  if (page > totalPages) {
    return res.status(401).json({
      message: "Page not found",
      success: false,
      error: true,
    });
  }

  const products = await ProductModel.find()
    .populate("category")
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec();

  if (!products) {
    return res.status(401).json({
      error: true,
      success: false,
    });
  }

  return res.status(201).json({
    success: true,
    error: false,
    products: products,
    totalPages: totalPages,
    page: page,
  });
}

export async function getAllProductsByCategoryIdController(req, res) {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10000;
  const totalPosts = await ProductModel.countDocuments();
  const totalPages = Math.ceil(totalPosts / perPage);

  if (page > totalPages) {
    return res.status(401).json({
      message: "Page not found",
      success: false,
      error: true,
    });
  }

  const products = await ProductModel.find({
    categoryId: req.params.id,
  })
    .populate("category")
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec();

  if (!products) {
    return res.status(401).json({
      error: true,
      success: false,
    });
  }

  return res.status(201).json({
    success: true,
    error: false,
    products: products,
    totalPages: totalPages,
    page: page,
  });
}

export async function getAllProductsByCategoryNameController(req, res) {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10000;
  const totalPosts = await ProductModel.countDocuments();
  const totalPages = Math.ceil(totalPosts / perPage);

  if (page > totalPages) {
    return res.status(401).json({
      message: "Page not found",
      success: false,
      error: true,
    });
  }

  const products = await ProductModel.find({
    categoryName: req.query.categoryName,
  })
    .populate("category")
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec();

  if (!products) {
    return res.status(401).json({
      error: true,
      success: false,
    });
  }

  return res.status(201).json({
    success: true,
    error: false,
    products: products,
    totalPages: totalPages,
    page: page,
  });
}

export async function getAllProductsBySubCategoryIdController(req, res) {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10000;
  const totalPosts = await ProductModel.countDocuments();
  const totalPages = Math.ceil(totalPosts / perPage);

  if (page > totalPages) {
    return res.status(401).json({
      message: "Page not found",
      success: false,
      error: true,
    });
  }

  const products = await ProductModel.find({
    subCategoryId: req.params.id,
  })
    .populate("category")
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec();

  if (!products) {
    return res.status(401).json({
      error: true,
      success: false,
    });
  }

  return res.status(201).json({
    success: true,
    error: false,
    products: products,
    totalPages: totalPages,
    page: page,
  });
}

export async function getAllProductsBySubCategoryNameController(req, res) {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10000;
  const totalPosts = await ProductModel.countDocuments();
  const totalPages = Math.ceil(totalPosts / perPage);

  if (page > totalPages) {
    return res.status(401).json({
      message: "Page not found",
      success: false,
      error: true,
    });
  }

  const products = await ProductModel.find({
    subCategory: req.query.subCategory,
  })
    .populate("category")
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec();

  if (!products) {
    return res.status(401).json({
      error: true,
      success: false,
    });
  }

  return res.status(201).json({
    success: true,
    error: false,
    products: products,
    totalPages: totalPages,
    page: page,
  });
}

export async function getAllProductsBythirdSubCategoryNameController(req, res) {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10000;
  const totalPosts = await ProductModel.countDocuments();
  const totalPages = Math.ceil(totalPosts / perPage);

  if (page > totalPages) {
    return res.status(401).json({
      message: "Page not found",
      success: false,
      error: true,
    });
  }

  const products = await ProductModel.find({
    thirdSubCategory: req.query.thirdSubCategory,
  })
    .populate("category")
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec();

  if (!products) {
    return res.status(401).json({
      error: true,
      success: false,
    });
  }

  return res.status(201).json({
    success: true,
    error: false,
    products: products,
    totalPages: totalPages,
    page: page,
  });
}

export async function getAllProductsBythirdSubCategoryIdController(req, res) {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10000;
  const totalPosts = await ProductModel.countDocuments();
  const totalPages = Math.ceil(totalPosts / perPage);

  if (page > totalPages) {
    return res.status(401).json({
      message: "Page not found",
      success: false,
      error: true,
    });
  }

  const products = await ProductModel.find({
    thirdSubCategoryId: req.params.id,
  })
    .populate("category")
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec();

  if (!products) {
    return res.status(401).json({
      error: true,
      success: false,
    });
  }

  return res.status(201).json({
    success: true,
    error: false,
    products: products,
    totalPages: totalPages,
    page: page,
  });
}

export async function getFilteredProductByPriceController(req, res) {
  let productList = [];

  if (req.query.categoryId !== "" && req.query.categoryId !== undefined) {
    const productListArray = await ProductModel.find({
      categoryId: req.query.categoryId,
    }).populate("category");

    productList = productListArray;
  }

  if (req.query.subCategoryId !== "" && req.query.subCategoryId !== undefined) {
    const productListArray = await ProductModel.find({
      subCategoryId: req.query.subCategoryId,
    }).populate("category");

    productList = productListArray;
  }

  if (
    req.query.thirdSubCategoryId !== "" &&
    req.query.thirdSubCategoryId !== undefined
  ) {
    const productListArray = await ProductModel.find({
      thirdSubCategoryId: req.query.thirdSubCategoryId,
    }).populate("category");

    productList = productListArray;
  }

  const filteredProducts = productList.filter((product) => {
    if (req.query.minPrice && product.price < parseInt(+req.query.minPrice)) {
      return false;
    }
    if (req.query.maxPrice && product.price > parseInt(+req.query.maxPrice)) {
      return false;
    }
    return true;
  });

  return res.status(200).json({
    products: filteredProducts,
    success: true,
    error: false,
  });
}

export async function getAllProductsByRatingController(req, res) {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10000;
  const totalPosts = await ProductModel.countDocuments();
  const totalPages = Math.ceil(totalPosts / perPage);

  if (page > totalPages) {
    return res.status(401).json({
      message: "Page not found",
      success: false,
      error: true,
    });
  }

  let products = [];

  if (req.query.categoryId !== undefined) {
    products = await ProductModel.find({
      rating: req.query.rating,
      categoryId: req.query.categoryId,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();
  }

  if (req.query.subCategoryId !== undefined) {
    products = await ProductModel.find({
      rating: req.query.rating,
      subCategoryId: req.query.subCategoryId,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();
  }

  if (req.query.thirdSubCategoryId !== undefined) {
    products = await ProductModel.find({
      rating: req.query.rating,
      thirdSubCategoryId: req.query.thirdSubCategoryId,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();
  }

  if (!products) {
    return res.status(401).json({
      error: true,
      success: false,
    });
  }

  return res.status(201).json({
    success: true,
    error: false,
    products: products,
    totalPages: totalPages,
    page: page,
  });
}

export async function getAllProductCountController(req, res) {
  const productsCount = await ProductModel.countDocuments();

  if (!productsCount) {
    return res.status(401).json({
      success: false,
      error: true,
    });
  }

  return res.status(201).json({
    success: true,
    error: false,
    totalProducts: productsCount,
  });
}

export async function getAllFeaturedProductController(req, res) {
  const products = await ProductModel.find({
    isFeatured: true,
  }).populate("category");
  if (!products) {
    return res.status(401).json({
      error: true,
      success: false,
    });
  }

  return res.status(201).json({
    success: true,
    error: false,
    products: products,
  });
}

export async function deleteProductController(req, res) {
  const product = await ProductModel.findById(req.params.id).populate(
    "category"
  );

  if (!product) {
    return res.status(401).json({
      message: "Product not found",
      error: true,
      success: false,
    });
  }

  let images = product.images;
  for (images of images) {
    const imageUrl = images;
    const urlArray = imageUrl.split("/");
    const image = urlArray[urlArray.length - 1];
    const imageName = image.split(".")[0];

    if (imageName) {
      cloudinary.uploader.destroy(imageName, (error, result) => {
        // console.log(error, result)
      });
    }
  }

  const deleteProduct = await ProductModel.findByIdAndDelete(req.params.id);

  if (!deleteProduct) {
    return res.status(401).json({
      message: "Product not deleted",
      success: false,
      error: true,
    });
  }

  return res.status(201).json({
    message: "Product Deleted",
    success: true,
    error: false,
  });
}

export async function getSingleProductController(req, res) {
  const product = await ProductModel.findById(req.params.id).populate(
    "category"
  );

  if (!product) {
    return res.status(401).json({
      message: "The product is not found",
      error: true,
      success: false,
    });
  }

  return res.status(201).json({
    success: true,
    error: false,
    product: product,
  });
}

export async function removeProductImageFromCloudinary(req, res) {
  const imageUrl = req.query.img;
  const urlArray = imageUrl.split("/");
  const image = urlArray[urlArray.length - 1];
  const imageName = image.split(".")[0];

  if (imageName) {
    const res = await cloudinary.uploader.destroy(
      imageName,
      (error, result) => {
        // console.log(error, res)
      }
    );
    if (res) {
      return res.status(200).json({
        res,
      });
    }
  }
}

export async function updateProductController(req, res) {
  let product = await ProductModel.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    description: req.body.description,
    images: imagesArray,
    brand: req.body.brand,
    price: req.body.price,
    oldPrice: req.body.oldPrice,
    categoryName: req.body.categoryName,
    categoryId: req.body.categoryId,
    subCategoryId: req.body.subCategoryId,
    subCategory: req.body.subCategory,
    thirdSubCategory: req.body.thirdSubCategory,
    thirdSubCategoryId: req.body.thirdSubCategoryId,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    isFeatured: req.body.isFeatured,
    discount: req.body.discount,
    productRam: req.body.productRam,
    size: req.body.size,
    productWeight: req.body.productWeight,
  });

  if (!product) {
    return res.status(401).json({
      message: "The product cannot be updated",
      success: false,
      error: true,
    });
  }

  imagesArray = [];

  return res.status(200).json({
    message: "Product is updated",
    success: true,
    error: false,
    product: product,
  });
}
