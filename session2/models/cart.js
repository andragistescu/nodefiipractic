const { Schema, model } = require("mongoose");

const productQuantity = new Schema({
  quantity: {
    default: 0,
    type: Number
  }
});

const cartSchema = new Schema(
  {
    products: {
      required: true,
      type: [productQuantity]
    },
    userId: {
      required: true,
      type: String
    },
    value: {
      require: true,
      type: Number
    }
  },
  {
    timestamps: true
  }
);

const Cart = model("carts", cartSchema);

module.exports = Cart;
