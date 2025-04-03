import MyListModel from "../models/myList.model.js";

export async function addToMyListController(req, res) {
  const userId = req.userId;
  const {
    productId,
    productTitle,
    image,
    rating,
    oldPrice,
    price,
    brand,
    discount,
  } = req.body;

  console.log(userId);

  const item = await MyListModel.findOne({
    userId: userId,
    productId: productId,
  });

  if (item) {
    return res.status(401).json({
      message: "Item already in my list",
      success: false,
      error: true,
    });
  }

  const myList = new MyListModel({
    productId,
    productTitle,
    image,
    rating,
    oldPrice,
    price,
    brand,
    discount,
    userId,
  });

  const save = await myList.save();

  return res.status(201).json({
    message: "The product saved in the my list",
    success: true,
    error: false,
    myList: save,
  });
}

export async function deleteFromMyListController(req, res) {
  const myList = await MyListModel.findById(req.params.id);

  if (!myList) {
    return res.status(401).json({
      error: true,
      success: true,
      message: "The item with this given id is not found",
    });
  }

  const deleteItem = await MyListModel.findByIdAndDelete(req.params.id);

  if (!deleteItem) {
    return res.status(401).json({
      error: true,
      success: true,
      message: "The item with this given id is not found",
    });
  }

  return res.status(200).json({
    error: false,
    success: true,
    message: "The item has been deleted",
  });
}

export async function getMyListController(req, res) {
  const userId = req.userId;

  const myList = await MyListModel.find({
    userId: userId,
  });

  return res.status(201).json({
    error: false,
    success: true,
    data: myList,
  });
}
