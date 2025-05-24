import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { config } from "dotenv";
import CategoryModel from "../models/category.model.js";
config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_APIKEY,
  api_secret: process.env.CLOUDINARY_CLOUD_APISECRET,
  secure: true,
});

let imagesArray = [];
export async function categoryImageUpload(req, res) {
  const images = req.files;

  imagesArray = [];

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
    images: imagesArray,
  });
}

export async function createCategoryController(req, res) {
  let category = new CategoryModel({
    name: req.body.name,
    parentCategoryName: req.body.parentCategoryName,
    images: imagesArray,
    parentId: req.body.parentId,
  });

  if (!category) {
    return res.status(401).json({
      message: "category not created",
      success: false,
      error: true,
    });
  }

  category = await category.save();
  imagesArray = [];

  return res.status(201).json({
    message: "category created",
    error: false,
    success: true,
    category,
  });
}

export async function getCategoryController(req, res) {
  const categories = await CategoryModel.find();
  const categoryMap = {};

  categories.forEach((cat) => {
    categoryMap[cat._id] = { ...cat._doc, children: [] };
  });

  const rootCategories = [];
  categories.forEach((cat) => {
    if (cat.parentId) {
      categoryMap[cat.parentId].children.push(categoryMap[cat._id]);
    } else {
      rootCategories.push(categoryMap[cat._id]);
    }
  });

  return res.status(201).json({
    data: rootCategories,
    success: true,
    error: false,
  });
}

export async function getCategoryCountController(req, res) {
  const categoryCount = await CategoryModel.countDocuments({
    parentId: undefined,
  });

  if (!categoryCount) {
    return res.status(500).json({
      success: false,
      error: true,
    });
  } else {
    return res.status(201).json({
      categoryCount: categoryCount,
    });
  }
}

export async function getSubCategoryCountController(req, res) {
  const categories = await CategoryModel.find();
  if (!categories) {
    return res.status(401).json({
      success: false,
      error: true,
    });
  } else {
    const subCategoryList = [];
    for (let cat of categories) {
      if (cat.parentId !== undefined) {
        subCategoryList.push(cat);
      }
    }
  }

  return res.status(201).json({
    subCategoryCount: categories.length,
  });
}

export async function getCategoryById(req, res) {
  const category = await CategoryModel.findById(req.params.id);

  if (!category) {
    return res.status(500).json({
      message: "The category with given ID is not found",
      success: false,
      error: true,
    });
  }

  return res.status(200).json({
    error: false,
    success: true,
    category: category,
  });
}

export async function removeCategoryImageFromCloudinary(req, res) {
  const imageUrl = req.query.img;
  const urlArray = imageUrl.split("/");
  const image = urlArray[urlArray.length - 1];
  const imageName = image.split(".")[0];

  if (imageName) {
    const response = await cloudinary.uploader.destroy(
      imageName,
      (error, result) => {
        // console.log(error, res)
      }
    );
    if (res) {
      return res.status(201).json({
        success: true,
        error: false,
        message: "Image deleted"
      })
    }
  }
}

export async function deleteCategoryController(req, res) {
  const category = await CategoryModel.findById(req.params.id);
  if (!category) {
    return res.status(401).json({
      message: "Category does not exists",
      success: false,
      error: true
    })
  }

  const subCategory = await CategoryModel.find({
    parentId: req.params.id,
  });

  for (let i = 0; i < subCategory.length; i++) {
    const thirdSubCategory = await CategoryModel.find({
      parentId: subCategory[i]._id,
    });

    for (let i = 0; i < thirdSubCategory.length; i++) {
      const deleteThirdSubCategory = await CategoryModel.findByIdAndDelete(
        thirdSubCategory[i]._id
      );
    }

    const deleteSubCategory = await CategoryModel.findByIdAndDelete(
      subCategory[i]._id
    );
  }

  const deleteCategory = await CategoryModel.findByIdAndDelete(req.params.id);

  if (!deleteCategory) {
    return res.status(401).json({
      message: "Category not found",
      success: false,
      error: true,
    });
  }

  return res.status(200).json({
    message: "Category deleted",
    success: true,
    error: false,
  });
}

export async function updateCategoryController(req, res) {
  const category = await CategoryModel.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    images: imagesArray.length > 0 ? imagesArray[0] : req.body.images,
    parentId: req.body.parentId,
    parentCategoryName: req.body.parentCategoryName,
  });

  if (!category) {
    return res.status(401).json({
      message: "Category cannot be updated",
      success: false,
      error: true,
    });
  }

  imagesArray = [];

  return res.status(200).json({
    message: "Category updated",
    error: false,
    success: true,
    category,
  });
}
