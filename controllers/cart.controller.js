import CartProductModel from "../models/cartProduct.model.js";
import UserModel from "../models/user.model.js";

export async function addToCartItemController(req, res) {
  const userId = req.userId;
  const { productId } = req.body;
  const quantity = req.body;

  if (!productId) {
    return res.status(401).json({
      message: "Provide product id",
      success: false,
      error: true,
    });
  }

  const checkItemCart = await CartProductModel.findOne({
    userId: userId,
    productId: productId,
  });

  if (checkItemCart) {
    return res.status(400).json({
      message: "Item already in cart",
      success: true,
      error: false,
    });
  }

  const cartItem = new CartProductModel({
    quantity: 1,
    userId: userId,
    productId: productId,
  });

  const save = await cartItem.save();

  const updateCartUser = await UserModel.updateOne(
    { _id: userId },
    {
      $push: {
        shoppingCart: productId,
      },
    }
  );

  return res.status(200).json({
    data: save,
    cartProduct: updateCartUser,
    message: "Item added successfully",
    success: true,
    error: false,
  });
}

export async function getCartItemController(req, res) {
  const userId = req.userId;

  const cartItem = await CartProductModel.find({
    userId: userId,
  }).populate("productId");

  return res.status(200).json({
    data: cartItem,
    error: false,
    success: true,
  });
}

export async function updateCartItemQuantityController(req, res) {
  const userId = req.userId;
  const { _id, quantity } = req.body;

  if (!_id || !quantity) {
    return res.status(400).json({
      message: "Provide id and quantity",
      success: false,
      error: true,
    });
  }

  const updateCartItem = await CartProductModel.updateOne(
    {
      _id: _id,
      userId: userId,
    },
    {
      quantity: quantity,
    }
  );

  return res.status(200).json({
    message: "Updated cart",
    success: true,
    error: false,
    data: updateCartItem,
  });
}

export async function deleteCartItemController(req, res) {
  const userId = req.userId;
  const { _id, productId } = req.body;

  if (!_id) {
    return res.status(400).json({
      message: "Provide _id",
      error: true,
      success: false,
    });
  }

  const deleteCartItem = await CartProductModel.deleteOne({
    _id: _id,
    userId: userId,
  });

  if (!deleteCartItem) {
    return res.status(401).json({
      message: "The product in the cart is not found",
      error: true,
      success: false,
    });
  }

  const user = await UserModel.findOne({
    _id: userId,
  });
  const cartItems = user?.shoppingCart;

  const updatedUserCart = [
    ...cartItems.slice(0, cartItems.indexOf(productId)),
    ...cartItems.slice(cartItems.indexOf(productId) + 1),
  ];

  user.shoppingCart = updatedUserCart;
  await user.save();

  return res.status(201).json({
    message: "Item removed",
    error: false,
    success: true,
    data: deleteCartItem,
  });
}
