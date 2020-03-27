const HttpStatusCode = require("http-status-codes");

const createCart = async (req, res) => {
  try {
    const {
      mongo: { ObjectId }
    } = require("mongoose");

    const products = await req.db.Product.find({
      _id: req.body.products.map(product => ObjectId(product._id))
    });

    let price = 0;

    for (const product of products) {
      let { quantity } = req.body.products.find(
        prod => prod._id == product._id
      );

      price += product.price * quantity;
    }

    const cart = await req.db.Cart.create({ ...req.body, price });

    return res.status(HttpStatusCode.CREATED).json({
      success: true,
      cart
    });
  } catch (error) {
    console.error(error);
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something bad happened!"
    });
  }
};

const getCart = async (req, res) => {
  try {
    const { cartId } = req.params;

    const {
      mongo: { ObjectId }
    } = require("mongoose");

    const cart = await req.db.Cart.findOne({
      _id: ObjectId(cartId)
    });

    const products = [];

    for (const product of cart.products) {
      const prod = await req.db.Product.findOne({
        _id: ObjectId(product._id)
      });

      products.push({ ...product.toObject(), ...prod.toObject() });
    }

    const user = await req.db.User.findOne(
      {
        _id: ObjectId(cart.userId)
      },
      {
        password: 0
      }
    );

    return res.status(HttpStatusCode.OK).json({
      success: true,
      cart: {
        ...cart.toObject(),
        user,
        products
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something bad happened!"
    });
  }
};

const updateCart = async (req, res) => {
  try {
    const { cartId } = req.params;

    const {
      mongo: { ObjectId }
    } = require("mongoose");

    let cart = await req.db.Cart.findOne({
      _id: ObjectId(cartId)
    });

    if (!cart) {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        success: false,
        message: "Cart not found"
      });
    }

    const { products } = req.body;

    await req.db.Cart.updateOne({ _id: ObjectId(cartId) }, { products });

    return res.status(HttpStatusCode.OK).json({
      success: true,
      cart: {
        ...cart.toObject(),
        products
      }
    });
  } catch (error) {
    console.error(error);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Somenthing bad happened!"
    });
  }
};

const deleteCart = async (req, res) => {
  try {
    const { cartId } = req.params;

    const {
      mongo: { ObjectId }
    } = require("mongoose");

    const cart = await req.db.Cart.findOne({
      _id: ObjectId(cartId)
    });

    if (!cart) {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        success: false,
        message: "Cart not found!"
      });
    }

    await req.db.Cart.deleteOne({
      _id: ObjectId(cartId)
    });

    return res.status(HttpStatusCode.NO_CONTENT).json({
      success: true
    });
  } catch (error) {
    console.error(error);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Somenthing bad happened!"
    });
  }
};

module.exports = {
  createCart,
  getCart,
  updateCart,
  deleteCart
};
