import HomeSliderModel from "../models/homeSlider.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_APIKEY,
  api_secret: process.env.CLOUDINARY_CLOUD_APISECRET
})

let imagesArray = [];
export async function homeSliderImageUploadController(req, res) {
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

export async function addHomeSlideController(req, res) {
  let slide = new HomeSliderModel({
    images: imagesArray
  })

  if (!slide) {
    return res.status(400).json({
      message: "Slide not created",
      error: true,
      success: false
    })
  }

  slide = await slide.save();
  imagesArray = [];

  return res.status(201).json({
    message: "Slide created",
    error: false,
    success: true,
    data: slide
  })
}

export async function getAllHomeSlidesController(req, res) {
  const slides = await HomeSliderModel.find();

  if (!slides) {
    return res.status(401).json({
      message: "Slides not found",
      error: true,
      success: false
    })
  }

  return res.status(200).json({
    error: false,
    success: true,
    data: slides
  })
}

export async function getSlideController(req, res) {
  const slide = await HomeSliderModel.findById(req.params.id);

  if (!slide) {
    res.status(500).json({
      message: "The slide with the given ID was not found",
      success: false,
      error: true
    })
  }

  return res.status(200).json({
    error: false,
    success: true,
    slide: slide
  })
}

export async function removeHomeSlideImageFromCloudinary(req, res) {
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

export async function deleteSlideController(req, res) {
  const slide = await HomeSliderModel.findById(req.params.id);
  const images = slide.images;
  let img = "";

  for (img of images) {
    const imgUrl = img;
    const urlArr = imgUrl.split("/");
    const image = urlArr[urlArr.length - 1];

    const imageName = image.split(".")[0];

    if (imageName) {
      cloudinary.uploader.destroy(imageName, (error, result) => {
        // console.log(error, result)
      })
    }
  }

  const deletedSlide = await HomeSliderModel.findByIdAndDelete(req.params.id);
  if (!deletedSlide) {
    return res.status(404).json({
      message: "Slide not found!",
      success: false,
      error: true
    })
  }

  return res.status(200).json({
    success: true,
    error: false,
    message: "Slide deleted"
  })
}

export async function updateSlideController(req, res) {
  const slide = await HomeSliderModel.findByIdAndUpdate(
    req.params.id,
    {
      images: imagesArray.length > 0 ? imagesArray[0] : req.body.images,
    },
    { new: true }
  )

  if (!slide) {
    return res.status(500).json({
      message: "Slide cannot be updated!",
      success: false,
      error: true
    })
  }

  imagesArray = [];

  return res.status(200).json({
    error: false,
    success: true,
    slide: slide,
    message: "Slide updated successfully"
  })
}

export async function deleteMultipleSlideController(req, res) {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids)) {
    return res.status(400).json({
      error: true,
      success: false,
      message: "Invalid input"
    })
  }

  for(let i = 0; i < ids?.length; i++) {
    const slide = await HomeSliderModel.findById(ids[i]);
    const images = slide.images;

    let img = "";

    for(img of images) {
      const imgUrl = img;
      const urlArr = imgUrl.split("/");
      const image = urlArr[urlArr.length - 1];

      const imageName = image.split(".")[0];

      if (imageName) {
        cloudinary.uploader.destroy(imageName, (error, result) => {
          // console.log(error, result)
        })
      }
    }
  }

  try {
    await HomeSliderModel.deleteMany({ _id: { $in: ids }});
    return res.status(200).json({
      message: "Product deleted successfully",
      error: false,
      success: true
    })

  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}