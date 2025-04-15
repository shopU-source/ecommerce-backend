import AddressModel from "../models/address.model.js";
import UserModel from "../models/user.model.js";

export async function addAddressController(req, res) {
  const { addressLine, city, state, pincode, country, phone, status } = req.body;
  const userId = req.userId
  console.log(userId)

  if (!addressLine || !city || !state || !pincode || !country || !phone) {
    return res.status(401).json({
      message: "Please provide all the fields",
      error: true,
      success: false
    })
  }

  const address = new AddressModel({
    addressLine, city, state, pincode, country, phone, userId, status
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
        Address: address?._id
      }
    })
  }

  return res.status(200).json({
    address: address,
    success: true,
    error: false
  })
}

export async function deletedAddressController(req, res) {
  const userId = req.userId
  const _id = req.params.id

  if (!_id) {
    return res.status(401).json({
      message: "Provide id",
      error: true,
      success: false
    })
  }

  const deleteAddress = await AddressModel.deleteOne({ _id: _id, userId: userId })

  if (deleteAddress.deletedCount === 0) {
    return res.status(401).json({
      message: "The address is not available",
      error: true,
      success: false
    })
  }

  const updateUser = await UserModel.updateOne(
    { _id: userId },
    { $pull: { addressDetails: _id } }
  )

  if (!updateUser.acknowledged) {
    return res.status(500).json({
      message: "Failed to update user's address references",
      error: true,
      success: false
    })
  }

  const remainingAddresses = await AddressModel.find({ userId: userId })

  return res.status(200).json({
    message: "Address deleted successfully",
    success: true,
    error: false,
    addresses: remainingAddresses
  })
}