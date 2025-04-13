import AddressModel from "../models/address.model.js";
import UserModel from "../models/user.model.js";

export async function addAddressController(req, res) {
  const { addressLine, city, state, pincode, country, phone, status, selected } = req.body;
  const userId = req.userId
  console.log(userId)

  if (!addressLine || !city || !state || !pincode || !country || !phone || !selected) {
    return res.status(401).json({
      message: "Please provide all the fields",
      error: true,
      success: false
    })
  }

  const address = new AddressModel({
    addressLine, city, state, pincode, country, phone, userId, status, selected
  })

  if (!address) {
    return res.status(401).json({
      message: "Address model does not created successfully",
      success: false,
      error: true
    })
  }

  const savedAddress = await address.save();

  if (!savedAddress) {
    return res.status(401).json({
      message: "Address model does not created successfully",
      success: false,
      error: true
    })
  }

  const updateUserAddress = await UserModel.updateOne({ _id: userId }, {
    $push: {
      addressDetails: savedAddress?._id
    }
  })

  if (!updateUserAddress) {
    return res.status(401).json({
      message: "Address model does not created successfully",
      success: false,
      error: true
    })
  }

  return res.status(200).json({
    data: savedAddress,
    message: "Address added successfully",
    error: false,
    success: true
  })
}

export async function getAddressController(req, res) {
  const address = await AddressModel.find({
    userId: req?.query?.userId
  })

  if (!address) {
    return res.status(400).json({
      message: "Address not found",
      error: true,
      success: false
    })
  }
  else {
    await UserModel.updateOne({
      _id: req?.query?.userId
    }, {
      $push: {
        addressDetails: address?._id
      }
    })
  }

  return res.status(200).json({
    address: address,
    success: true,
    error: false
  })
}

